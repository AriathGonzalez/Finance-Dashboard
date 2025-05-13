"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { DatabaseZap, Link2, PlusCircle, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

type SystemType = "skyward" | "sap" | "munis" | "other";

interface ConnectionDetails {
  id: string;
  systemType: SystemType;
  systemName: string;
  apiEndpoint: string;
  username: string;
  // Password and API key are not stored or displayed for security, handled server-side
}

const FormCardSkeleton = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" /> {/* CardTitle */}
      <Skeleton className="h-4 w-full" /> {/* CardDescription */}
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
    <CardFooter className="flex justify-end">
      <Skeleton className="h-10 w-32" /> {/* Button */}
    </CardFooter>
  </Card>
);


export function ExternalDataConnectionsSection() {
  const [systemType, setSystemType] = useState<SystemType | undefined>(undefined);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [customSystemName, setCustomSystemName] = useState(''); 

  const [connections, setConnections] = useState<ConnectionDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!systemType) {
      setError("Please select a system type.");
      toast({ title: "Error", description: "System type is required.", variant: "destructive" });
      return;
    }
    if (systemType === "other" && !customSystemName.trim()) {
      setError("Please specify the system name for 'Other'.");
      toast({ title: "Error", description: "System name is required for 'Other'.", variant: "destructive" });
      return;
    }
    if (!apiEndpoint.trim()) {
      setError("API Endpoint / Connection String is required.");
      toast({ title: "Error", description: "API Endpoint is required.", variant: "destructive" });
      return;
    }
     if (!username.trim()) {
      setError("Username is required.");
      toast({ title: "Error", description: "Username is required.", variant: "destructive" });
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      toast({ title: "Error", description: "Password is required.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      // Mock API call to save connection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newConnection: ConnectionDetails = {
        id: Date.now().toString(),
        systemType,
        systemName: systemType === "other" ? customSystemName : systemType.charAt(0).toUpperCase() + systemType.slice(1),
        apiEndpoint,
        username,
      };
      
      setConnections(prev => [...prev, newConnection]);
      
      toast({
        title: "Connection Saved (Mock)",
        description: `Connection to ${newConnection.systemName} configured. In a real app, this would be securely stored.`,
        className: "bg-green-500 text-white"
      });

      // Reset form
      setSystemType(undefined);
      setApiEndpoint('');
      setUsername('');
      setPassword('');
      setApiKey('');
      setCustomSystemName('');
    });
  };

  return (
    <section aria-labelledby="external-data-title" className="mt-8">
      <h2 id="external-data-title" className="text-2xl font-semibold mb-4 text-foreground flex items-center">
        <Link2 className="mr-2 h-6 w-6 text-primary" /> External Data Connections
      </h2>
      
      {isClient ? (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Add New Data Source</CardTitle>
            <CardDescription>
              Configure connections to external financial systems like Skyward, SAP, or Munis.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systemType">System Type</Label>
                  <Select 
                    value={systemType} 
                    onValueChange={(value: SystemType) => setSystemType(value)}
                    disabled={isPending}
                  >
                    <SelectTrigger id="systemType">
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skyward">Skyward</SelectItem>
                      <SelectItem value="sap">SAP</SelectItem>
                      <SelectItem value="munis">Munis</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {systemType === "other" && (
                  <div>
                      <Label htmlFor="customSystemName">System Name (if Other)</Label>
                      <Input
                      id="customSystemName"
                      type="text"
                      value={customSystemName}
                      onChange={(e) => setCustomSystemName(e.target.value)}
                      placeholder="e.g., Custom ERP"
                      disabled={isPending}
                      />
                  </div>
                  )}
              </div>
              
              <div>
                <Label htmlFor="apiEndpoint">API Endpoint / Connection String</Label>
                <Input
                  id="apiEndpoint"
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="e.g., https://api.example.com/v1"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isPending}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="apiKey">API Key / Token (Optional)</Label>
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key or token if required"
                  disabled={isPending}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Connection
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : <FormCardSkeleton /> }


      {isPending && !connections.length && (
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {connections.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Existing Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {connections.map(conn => (
                <li key={conn.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <DatabaseZap className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">{conn.systemName}</p>
                      <p className="text-xs text-muted-foreground">{conn.apiEndpoint}</p>
                    </div>
                  </div>
                   {/* Actions like Edit/Delete would go here in a real app */}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
