'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause, Mic, CheckCircle, RefreshCw, Headphones, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Message = {
  id: number
  speaker: 'A' | 'B'
  role: 'Customer' | 'Barista'
  targetLanguage: string
  nativeLanguage: string
  audioUrl: string
}

const messages: Message[] = [
  {
    id: 1,
    speaker: 'A',
    role: 'Customer',
    targetLanguage: 'Bonjour, je voudrais un café s'il vous plaît.',
    nativeLanguage: 'Hello, I would like a coffee please.',
    audioUrl: '/audio/message1.mp3',
  },
  {
    id: 2,
    speaker: 'B',
    role: 'Barista',
    targetLanguage: 'Bien sûr, vous voulez un café noir ou au lait ?',
    nativeLanguage: 'Of course, would you like black coffee or with milk?',
    audioUrl: '/audio/message2.mp3',
  },
  {
    id: 3,
    speaker: 'A',
    role: 'Customer',
    targetLanguage: 'Un café au lait, s'il vous plaît. Et pourrais-je avoir un croissant aussi ?',
    nativeLanguage: 'A coffee with milk, please. And could I have a croissant too?',
    audioUrl: '/audio/message3.mp3',
  },
  {
    id: 4,
    speaker: 'B',
    role: 'Barista',
    targetLanguage: 'Certainement. Ce sera tout ?',
    nativeLanguage: 'Certainly. Will that be all?',
    audioUrl: '/audio/message4.mp3',
  },
  {
    id: 5,
    speaker: 'A',
    role: 'Customer',
    targetLanguage: 'Oui, c'est tout. Combien je vous dois ?',
    nativeLanguage: 'Yes, that's all. How much do I owe you?',
    audioUrl: '/audio/message5.mp3',
  },
  {
    id: 6,
    speaker: 'B',
    role: 'Barista',
    targetLanguage: 'Ça fera 5 euros 50, s'il vous plaît.',
    nativeLanguage: 'That will be 5 euros 50, please.',
    audioUrl: '/audio/message6.mp3',
  },
  {
    id: 7,
    speaker: 'A',
    role: 'Customer',
    targetLanguage: 'Voici 6 euros. Gardez la monnaie.',
    nativeLanguage: 'Here's 6 euros. Keep the change.',
    audioUrl: '/audio/message7.mp3',
  },
  {
    id: 8,
    speaker: 'B',
    role: 'Barista',
    targetLanguage: 'Merci beaucoup. Bonne journée !',
    nativeLanguage: 'Thank you very much. Have a nice day!',
    audioUrl: '/audio/message8.mp3',
  },
]

const speedOptions = [
  { label: '🐢 0.5x', value: 0.5 },
  { label: '🚶 0.75x', value: 0.75 },
  { label: '🚶‍♂️ 1x', value: 1 },
  { label: '🏃 1.25x', value: 1.25 },
]

export function ChatExchangeComponent() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: number }>({})
  const [isRecording, setIsRecording] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null)
  const [audioProgress, setAudioProgress] = useState<{ [key: number]: number }>({})
  const [hasListened, setHasListened] = useState(false)
  const [runThrough, setRunThrough] = useState(1)
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false)
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentSection, setCurrentSection] = useState(0)

  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({})

  useEffect(() => {
    setHasListened(false)
    setPronunciationFeedback(null)
  }, [currentExercise])

  useEffect(() => {
    const totalCompletions = Object.values(completedExercises).reduce((sum, count) => sum + count, 0)
    if (totalCompletions === messages.length * 2) {
      setAllExercisesCompleted(true)
    }
  }, [completedExercises])

  useEffect(() => {
    messages.forEach(message => {
      const audio = new Audio(message.audioUrl)
      audio.addEventListener('timeupdate', () => {
        setAudioProgress(prev => ({
          ...prev,
          [message.id]: (audio.currentTime / audio.duration) * 100
        }))
      })
      audio.addEventListener('ended', () => {
        setAudioPlaying(null)
        setAudioProgress(prev => ({ ...prev, [message.id]: 0 }))
      })
      audioRefs.current[message.id] = audio
    })

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.playbackRate = playbackSpeed
    })
  }, [playbackSpeed])

  const toggleAudio = (id: number) => {
    const audio = audioRefs.current[id]
    if (audioPlaying === id) {
      audio.pause()
      setAudioPlaying(null)
    } else {
      if (audioPlaying !== null) {
        audioRefs.current[audioPlaying].pause()
      }
      audio.playbackRate = playbackSpeed
      audio.play()
      setAudioPlaying(id)
      if (id === messages[currentExercise].id) {
        setHasListened(true)
        if (getExerciseType(messages[currentExercise]) === 'listen') {
          markExerciseComplete(id)
          handleNextExercise()
        }
      }
    }
  }

  const listenToCurrentExercise = () => {
    const currentMessageId = messages[currentExercise].id
    if (audioPlaying === currentMessageId) {
      audioRefs.current[currentMessageId].pause()
      setAudioPlaying(null)
    } else {
      toggleAudio(currentMessageId)
    }
  }

  const markExerciseComplete = (id: number) => {
    setCompletedExercises(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, runThrough)
    }))
  }

  const handleNextExercise = () => {
    if (currentExercise < messages.length - 1) {
      setCurrentExercise(currentExercise + 1)
      if (currentExercise === 3) {
        setCurrentSection(1)
      }
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic here
    } else {
      // Stop recording logic here
      if (getExerciseType(messages[currentExercise]) === 'listenAndRepeat') {
        markExerciseComplete(messages[currentExercise].id)
        handleNextExercise()
      }
      providePronunciationFeedback()
    }
  }

  const providePronunciationFeedback = () => {
    const feedbackOptions = [
      "Great pronunciation! Keep it up!",
      "Good effort. Try to emphasize the 'r' sound more.",
      "Nice try. Focus on the nasal sounds in this phrase.",
      "Well done. Pay attention to the liaison between words."
    ]
    const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
    setPronunciationFeedback(randomFeedback)
  }

  const isActiveExercise = (message: Message) => {
    return currentExercise === messages.indexOf(message)
  }

  const getExerciseType = (message: Message) => {
    if (runThrough === 1) {
      return message.speaker === 'B' ? 'listenAndRepeat' : 'listen'
    } else {
      return message.speaker === 'A' ? 'listenAndRepeat' : 'listen'
    }
  }

  const getExerciseInstructions = (message: Message) => {
    const exerciseType = getExerciseType(message)
    return exerciseType === 'listenAndRepeat'
      ? 'Listen to the audio, then repeat the sentence.'
      : 'Listen to the audio carefully.'
  }

  const getCompletionStatus = (message: Message) => {
    return completedExercises[message.id] || 0
  }

  const isCurrentRunThroughCompleted = () => {
    return messages.every(message => getCompletionStatus(message) >= runThrough)
  }

  const isFirstSectionCompleted = () => {
    return messages.slice(0, 4).every(message => getCompletionStatus(message) >= runThrough)
  }

  const switchSpeakers = () => {
    setRunThrough(2)
    setCurrentExercise(0)
    setCurrentSection(0)
    setHasListened(false)
    setPronunciationFeedback(null)
  }

  const startNewSession = () => {
    setRunThrough(1)
    setCurrentExercise(0)
    setCurrentSection(0)
    setCompletedExercises({})
    setAllExercisesCompleted(false)
    setHasListened(false)
    setPronunciationFeedback(null)
  }

  const currentMessage = messages[currentExercise]
  const visibleMessages = messages.slice(currentSection * 4, currentSection * 4 + 4)

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Language Exchange</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Conversation Subject: Talking at a cafe
        </p>
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=192&width=384"
            alt="Image of a cafe"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Exercise {currentExercise + 1} of {messages.length}
        </p>
        <p className="text-sm font-medium">Run Through: {runThrough}</p>
        <p className="text-sm font-medium">Section: {currentSection + 1} of 2</p>
      </div>

      <Progress 
        value={(currentExercise + 1) / messages.length * 100} 
        className="w-full"
      />

      {!isCurrentRunThroughCompleted() && !allExercisesCompleted && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <p>{getExerciseInstructions(currentMessage)}</p>
        </div>
      )}

      {pronunciationFeedback && !allExercisesCompleted && (
        <Alert>
          <AlertTitle>Pronunciation Feedback</AlertTitle>
          <AlertDescription>{pronunciationFeedback}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {visibleMessages.map((message, index) => (
          <div key={message.id} className="space-y-2">
            <div className={`text-sm font-semibold ${message.speaker === 'A' ? 'text-left' : 'text-right'}`}>
              {message.role} {(runThrough === 1 && message.speaker === 'B') || (runThrough === 2 && message.speaker === 'A') ? '(you)' : ''}
            </div>
            <div
              className={`flex flex-col ${
                message.speaker === 'A' ? 'items-start' : 'items-end'
              } ${!isActiveExercise(message) ? 'opacity-50' : ''}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.speaker === 'A' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                } ${
                  isActiveExercise(message) && !allExercisesCompleted
                    ? 'border-2 border-accent animate-pulse'
                    : 'border-2 border-transparent'
                }`}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{message.targetLanguage}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-0 h-6 w-6"
                      onClick={() => toggleAudio(message.id)}
                    >
                      {audioPlaying === message.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="sr-only">{audioPlaying === message.id ? 'Pause' : 'Play'} audio</span>
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{message.nativeLanguage}</span>
                  {audioPlaying === message.id && (
                    <Progress 
                      value={audioProgress[message.id] || 0}
                      className={`w-full mt-2 ${
                        message.speaker === 'A' 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-secondary-foreground/20'
                      }`}
                      indicatorClassName={`${
                        message.speaker === 'A' 
                          ? 'bg-accent' 
                          : 'bg-primary'
                      }`}
                    />
                  )}
                </div>
              </div>
              {isActiveExercise(message) && !allExercisesCompleted && (
                <div className="mt-2 flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={listenToCurrentExercise}
                  >
                    {audioPlaying === message.id ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Headphones className="h-4 w-4 mr-2" />
                    )}
                    {audioPlaying === message.id ? 'Pause' : 'Listen'}
                  </Button>
                  {getExerciseType(message) === 'listenAndRepeat' && hasListened && (
                    <Button
                      size="sm"
                      variant={isRecording ? 'destructive' : 'default'}
                      onClick={toggleRecording}
                      disabled={!hasListened}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {isRecording ? 'Stop' : 'Record'}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        {speedOptions.find(option => option.value === playbackSpeed)?.label}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {speedOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onSelect={() => setPlaybackSpeed(option.value)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div className="flex mt-1">
                {[...Array(getCompletionStatus(message))].map((_, i) => (
                  <CheckCircle key={i} className="h-4 w-4 text-green-500 mr-1" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentSection === 0 && isFirstSectionCompleted() && (
        <div className="mt-4">
          <Button onClick={() => setCurrentSection(1)} className="w-full">
            Continue to Next Section
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {isCurrentRunThroughCompleted() && !allExercisesCompleted && (
        <div className="text-center mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">Great job! You've completed the first run-through.</p>
          <p>Let's switch roles and try again!</p>
          <Button onClick={switchSpeakers} className="w-full mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Switch Speakers (Current: {runThrough === 1 ? 'Barista' : 'Customer'})
          </Button>
        </div>
      )}

      {allExercisesCompleted && (
        <div className="text-center mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">Great job! You've completed all exercises for both speakers.</p>
          <p>Start a new session to practice more!</p>
          <Button onClick={startNewSession} className="w-full mt-4">
            Start New Session
          </Button>
        </div>
      )}
    </div>
  )
}