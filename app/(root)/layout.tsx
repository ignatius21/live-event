import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Live-Event",
  description: "Speek with your friends and family in a live event",
  icons: {
    icon:'/icons/logo.svg',
  }
};

const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <div>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </div>
  )
}

export default RootLayout