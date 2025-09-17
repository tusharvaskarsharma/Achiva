import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface StudyTimerProps {
  onHoursUpdated: () => void;
}

export const StudyTimer = ({ onHoursUpdated }: StudyTimerProps) => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const totalPausedTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = new Date();
      totalPausedTimeRef.current = 0;
      toast.success("Study timer started!");
    } else if (isPaused) {
      setIsPaused(false);
      toast.success("Study timer resumed!");
    }
  };

  const handlePause = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      toast.info("Study timer paused");
    }
  };

  const handleStop = async () => {
    if (isRunning && seconds > 0) {
      const studyHours = parseFloat((seconds / 3600).toFixed(2));
      
      try {
        // Check if there's already a study_hours entry for today
        const today = new Date().toISOString().split('T')[0];
        const { data: existingData, error: fetchError } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', user?.id)
          .eq('metric_name', 'study_hours')
          .eq('metric_date', today)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingData) {
          // Update existing record
          const newValue = Number(existingData.metric_value) + studyHours;
          const { error: updateError } = await supabase
            .from('analytics')
            .update({ 
              metric_value: newValue,
              created_at: new Date().toISOString()
            })
            .eq('id', existingData.id);

          if (updateError) throw updateError;
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('analytics')
            .insert({
              user_id: user?.id,
              metric_name: 'study_hours',
              metric_value: studyHours,
              metric_date: today
            });

          if (insertError) throw insertError;
        }

        toast.success(`Study session saved! ${studyHours} hours added.`);
        onHoursUpdated();
      } catch (error) {
        console.error('Error saving study hours:', error);
        toast.error("Failed to save study hours");
      }
    }

    // Reset timer
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    startTimeRef.current = null;
    totalPausedTimeRef.current = 0;
  };

  const getStatusColor = () => {
    if (!isRunning) return "text-muted-foreground";
    if (isPaused) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusText = () => {
    if (!isRunning) return "Ready to start";
    if (isPaused) return "Paused";
    return "Active";
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="hero-gradient p-2 rounded-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          Study Timer
        </CardTitle>
        <CardDescription>
          Track your study sessions and build consistent habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(seconds)}
          </div>
          <div className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {!isRunning || isPaused ? (
            <Button 
              onClick={handleStart}
              className="flex items-center gap-2"
              size="lg"
            >
              <Play className="h-4 w-4" />
              {!isRunning ? "Start" : "Resume"}
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              variant="secondary" 
              className="flex items-center gap-2"
              size="lg"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          
          {isRunning && (
            <Button 
              onClick={handleStop}
              variant="destructive" 
              className="flex items-center gap-2"
              size="lg"
            >
              <Square className="h-4 w-4" />
              Stop & Save
            </Button>
          )}
        </div>

        {seconds > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Current session: {(seconds / 3600).toFixed(2)} hours
          </div>
        )}
      </CardContent>
    </Card>
  );
};