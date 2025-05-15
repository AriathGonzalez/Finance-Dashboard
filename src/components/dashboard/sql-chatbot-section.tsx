
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
  AlertTriangle,
  Sparkles,
  Speech,
  Send, // Changed from Terminal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { v4 as uuidv4 } from "uuid";

export function SqlChatbotSection() {
  const [question, setQuestion] = useState("");
  // Removed sqlQuery and setSqlQuery state
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
    // Removed setSqlQuery("");
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

        // Removed setting SQL query: setSqlQuery(data.sql_function_call || "No SQL query returned.");
        setNaturalLanguageAnswer(data.answer); 

        toast({
          title: "Success",
          description: "Answer generated successfully!", // Updated toast message
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
          <CardTitle>Ask the AI</CardTitle> 
          <CardDescription>
            Ask a question in natural language, and the AI will provide an answer based on the available data.
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
              placeholder="e.g., What was the total revenue last quarter?"
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
                  <Send className="mr-2 h-4 w-4" /> 
                  Ask
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

      {/* Removed the Card that displayed the SQL Query */}

      {naturalLanguageAnswer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Speech className="mr-2 h-5 w-5 text-primary" />
              AI's Answer
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

