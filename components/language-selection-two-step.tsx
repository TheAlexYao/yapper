'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GlobeIcon, ArrowLeftIcon, BookOpenIcon, MessageCircleIcon } from 'lucide-react'

const languages = [
  { name: 'English (United States)', code: 'en-US', flag: '🇺🇸', base: 'English' },
  { name: 'French (France)', code: 'fr-FR', flag: '🇫🇷', base: 'French' },
  { name: 'German (Germany)', code: 'de-DE', flag: '🇩🇪', base: 'German' },
  { name: 'Hindi (India)', code: 'hi-IN', flag: '🇮🇳', base: 'Hindi' },
  { name: 'Italian (Italy)', code: 'it-IT', flag: '🇮🇹', base: 'Italian' },
  { name: 'Portuguese (Brazil)', code: 'pt-BR', flag: '🇧🇷', base: 'Portuguese' },
  { name: 'Portuguese (Portugal)', code: 'pt-PT', flag: '🇵🇹', base: 'Portuguese' },
  { name: 'Spanish (Mexico)', code: 'es-MX', flag: '🇲🇽', base: 'Spanish' },
  { name: 'Spanish (Spain)', code: 'es-ES', flag: '🇪🇸', base: 'Spanish' },
  { name: 'Thai (Thailand)', code: 'th-TH', flag: '🇹🇭', base: 'Thai' },
]

export function LanguageSelectionTwoStep() {
  const [step, setStep] = useState<'native' | 'target'>('native')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')

  const handleLanguageSelect = (langCode: string) => {
    if (step === 'native') {
      setNativeLanguage(langCode)
      setStep('target')
    } else {
      setTargetLanguage(langCode)
    }
  }

  const handleBack = () => {
    setStep('native')
    setTargetLanguage('')
  }

  const handleStartExercise = () => {
    console.log('Starting exercise with:', { nativeLanguage, targetLanguage })
    // Here you would typically navigate to the exercise page or update the app state
  }

  const LanguageList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {languages.map((lang) => {
        const isSelected = (step === 'native' && lang.code === nativeLanguage) ||
                           (step === 'target' && lang.code === targetLanguage)
        const isDisabled = step === 'target' && (languages.find(l => l.code === nativeLanguage)?.base === lang.base || lang.code === nativeLanguage)
        
        if (step === 'target' && lang.code === nativeLanguage) {
          return null // Hide the native language option in the second screen
        }

        return (
          <Button
            key={lang.code}
            variant={isSelected ? 'default' : 'outline'}
            className={`w-full justify-start text-left h-auto py-3 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => handleLanguageSelect(lang.code)}
            disabled={isDisabled}
          >
            <span className="mr-2 text-2xl" role="img" aria-label={`Flag for ${lang.name}`}>
              {lang.flag}
            </span>
            <span className="text-sm">{lang.name}</span>
          </Button>
        )
      })}
    </div>
  )

  return (
    <div className={`flex items-center justify-center min-h-screen ${step === 'native' ? 'bg-gradient-to-b from-primary/20 to-secondary/20' : 'bg-white'} p-4 transition-colors duration-300`}>
      <Card className={`w-full max-w-4xl ${step === 'target' ? 'border-primary/20 shadow-lg' : ''}`}>
        <CardHeader className={step === 'target' ? 'bg-primary text-primary-foreground rounded-t-lg' : ''}>
          <CardTitle className="text-3xl font-bold text-center">
            {step === 'native' ? (
              <>
                <MessageCircleIcon className="inline-block mr-2 mb-1" />
                Select Your Primary Language
              </>
            ) : (
              <>
                <BookOpenIcon className="inline-block mr-2 mb-1" />
                What Language Do You Want to Learn?
              </>
            )}
          </CardTitle>
          <CardDescription className={`text-center text-lg mt-2 ${step === 'target' ? 'text-primary-foreground/80' : ''}`}>
            {step === 'native' 
              ? "Choose the language you're most comfortable with."
              : "Select the language you'd like to start learning or improve."}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <LanguageList />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 mt-6">
          {step === 'target' && (
            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Primary Language
            </Button>
          )}
          {nativeLanguage && targetLanguage && (
            <Button 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={handleStartExercise}
            >
              <GlobeIcon className="w-4 h-4 mr-2" />
              Start Language Journey
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}