'use client';

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";
import {motion} from 'framer-motion';



const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values,setValues] = useState({
      dateTime: new Date(),
      description: '',
      link: '',
    })

    const [callDetails, setcallDetails] = useState<Call>()
    const {toast} = useToast();

    const createMeeting = async () => {
        if(!client || !user) return;
        try {
          if(!values.dateTime) {
            toast({title: "Seleccionar fecha y hora"})
            return;
          }
          const id = crypto.randomUUID();
          const call = client.call('default',id);
          if(!call) throw new Error('Error al crear la reunion');
          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
          const description = values.description || 'Reunion Instantanea';

          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description,
              }
            }
          })
          setcallDetails(call);
          if(!values.description) {
            router.push(`/meeting/${call.id}`);
          }
          toast({title: "Reunion creada exitosamente"})
        } catch (error) {
          console.log(error)
          toast({title: "Error al crear reunion"})
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
    
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <motion.div whileHover={{scale: 1.1,transition: { duration: 0.3 },}}>
        <HomeCard 
          img={"/icons/add-meeting.svg"}
          title={"Nueva Reunion"}
          description={"Comenzar una reunion instantanea"}
          handleClick={() => setMeetingState('isInstantMeeting')}
          className="bg-orange-1"
        />
      </motion.div>
      <motion.div whileHover={{scale: 1.1,transition: { duration: 0.3 },}}>
        <HomeCard 
          img={"/icons/schedule.svg"}
          title={"Programar Reunion"}
          description={"Agendar reunion"}
          handleClick={() => setMeetingState('isScheduleMeeting')}
          className="bg-blue-1"
        />
      </motion.div>
      <motion.div whileHover={{scale: 1.1,transition: { duration: 0.3 },}}>
        <HomeCard 
          img={"/icons/recordings.svg"}
          title={"Grabaciones"}
          description={"Ver grabaciones"}
          handleClick={() => router.push('/recordings')}
          className="bg-purple-1"
        />
      </motion.div>
      <motion.div whileHover={{scale: 1.1,transition: { duration: 0.3 },}}>
        <HomeCard 
          img={"/icons/join-meeting.svg"}
          title={"Unirse a Reunion"}
          description={"Mediante ID de reunion"}
          handleClick={() => setMeetingState('isJoiningMeeting')}
          className="bg-yellow-1"
        />
      </motion.div>
      {!callDetails ? (
        <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Crear Reunion"
        handleClick={createMeeting}
      >
        <div className="flex flex-col gap-5">
          <label className="text-base text-normal leading-[22px] text-sky-2">
            <Textarea 
              onChange={(e) => setValues({...values, description: e.target.value})}
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            Agregar descripción
          </label>
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <ReactDatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({...values, dateTime: date!})}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full bg-dark-3 rounded p-2 focus:outline-none"
          />
        </div>
      </MeetingModal>
      ):(
        <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Reunion Creada"
        className="text-center"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({title: "Link copiado"})
        }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText='Copiar Meeting Link'
      />
      )}
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Reunion Instantanea"
        className="text-center"
        buttonText='Comenzar Reunion'
        handleClick={createMeeting}
      />
      <MeetingModal 
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Copiar ID de reunion"
        className="text-center"
        buttonText='Unirse a reunion'
        handleClick={() => router.push(values.link)}
      >
        <Input placeholder="Link de reunion" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => setValues({...values, link:e.target.value})}/>

      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList