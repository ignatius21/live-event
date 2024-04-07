'use client';

import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupComplete}:{setIsSetupComplete: (value:boolean) => void}) => {

    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)

    const call = useCall()
    if(!call) {
        throw new Error('Llamada no encontrada')
    } 

    useEffect(() => {
        if(isMicCamToggledOn) {
            call?.camera?.disable()
            call?.microphone?.disable()
        } else {
            call?.camera?.enable()
            call?.microphone?.enable()
        }
    }, [isMicCamToggledOn,call?.camera,call?.microphone])

  return (
    <div className="flex h-screen w-ful flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">LIVE-EVENT</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label
          htmlFor=""
          className="flex items-center justify-center gap-2 font-medium"
        >
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          <span>Apagar camara y microfono</span>
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Unirse a la llamada
      </Button>
    </div>
  );
}

export default MeetingSetup