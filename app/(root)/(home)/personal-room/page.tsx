'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'


 const Table = ({title, description}:{title:string; description: string;}) => {
  return (
    <div className='flex flex-col items-start gap-10 xl:flex-row'>
      <h1 className='text-base font-medium text-red-1 lg:text-xl xl:min-w-32'>{title}:</h1>
      <h2 className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>{description}</h2>
    </div>
  );
}




const Personal = () => {
  const { user } = useUser();
  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();
  const {call} = useGetCallById(meetingId!);


  const startRoom = async () => {
    if(!client || !user) return;

    const newCall = client.call('default', meetingId!);

    if(!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        }
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  }
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Sala Personal
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[1200px]'>
        <Table title='Sala de' description={`${user?.firstName}`}/>
        <Table title='ID de Reunion' description={`${user?.id}`}/>
        <Table title='Link de invitación' description={meetingLink}/>
      </div>
      <div className='flex gap-5'>
        <Button className='bg-blue-1' onClick={startRoom}>
          Comenzar Reunion
        </Button>
        <Button className='bg-dark-3' onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({
                  title: "Link Copiado",
                });
              }}>
                Copiar Invitacion
              </Button>
      </div>
    </section>
  )
}

export default Personal