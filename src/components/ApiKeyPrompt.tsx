
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setApiKey } from '@/services/openaiService';
import { toast } from '@/hooks/use-toast';

interface ApiKeyPromptProps {
  onApiKeySet: () => void;
  onSkip: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySet, onSkip }) => {
  const [apiKey, setApiKeyValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "OpenAI API key has been saved locally for AI summarization.",
      });
      onApiKeySet();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Enable AI Summarization</CardTitle>
          <CardDescription>
            Enter your OpenAI API key to get AI-powered article summaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Get your API key at{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save & Continue
              </Button>
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 text-center">
            Your API key is stored locally and never shared
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyPrompt;
