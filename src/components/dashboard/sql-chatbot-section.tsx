"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  MessageCircle,
  Terminal,
  AlertTriangle,
  Sparkles,
  Speech,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { v4 as uuidv4 } from "uuid";

export function SqlChatbotSection() {
  const [question, setQuestion] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [naturalLanguageAnswer, setNaturalLanguageAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [userId, setUserId] = useState("");

  // Generate/store user ID on mount
  useEffect(() => {
    let storedId = localStorage.getItem("user_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSqlQuery("");
    setNaturalLanguageAnswer("");

    startTransition(async () => {
      if (!question.trim()) {
        setError("Question cannot be empty.");
        toast({
          title: "Error",
          description: "Please enter a question.",
          variant: "destructive",
        });
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/chat-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: question, user: userId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unknown error from server");
        }

        setSqlQuery(data.sqlQuery || "No SQL query returned.");
        setNaturalLanguageAnswer(data.answer); // Set the natural language answer if available

        toast({
          title: "Success",
          description: "SQL query and explanation generated successfully!",
          className: "bg-green-500 text-white",
        });
      } catch (err: any) {
        console.error("Error:", err.message);
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <section aria-labelledby="sql-chatbot-title" className="mt-8">
      <h2
        id="sql-chatbot-title"
        className="text-2xl font-semibold mb-4 text-foreground flex items-center"
      >
        <MessageCircle className="mr-2 h-6 w-6 text-primary" /> AI SQL Query
        Chatbot
      </h2>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Natural Language to SQL</CardTitle>
          <CardDescription>
            Ask a question in natural language, and the AI will translate it
            into an SQL query and provide an explanation.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label htmlFor="naturalLanguageQuestion" className="mb-1 block">
              Your Question
            </Label>
            <Input
              id="naturalLanguageQuestion"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Show me total revenue per month for the last quarter"
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Terminal className="mr-2 h-4 w-4" />
                  Generate SQL & Explanation
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sqlQuery && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-primary" />
              Generated SQL Query
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm text-muted-foreground overflow-x-auto">
              <code>{sqlQuery}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Note: This query is generated by AI. Always review and test SQL
              queries before running them on a production database.
            </p>
          </CardContent>
        </Card>
      )}

      {naturalLanguageAnswer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Speech className="mr-2 h-5 w-5 text-primary" />
              Natural Language Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {naturalLanguageAnswer}
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
