"use client"

import { useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize MiniKit
    if (typeof window !== 'undefined') {
      console.log('MiniKit installed:', MiniKit.isInstalled())
    }
  }, [])

  return <>{children}</>
} 