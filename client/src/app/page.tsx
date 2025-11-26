import EventCards from '@/components/ui/EventCards'
import React from 'react'
import {fetchEvents} from '@/lib/api'



const page = async() => {
  const events = await fetchEvents();
  return (
    <div>
      <EventCards events={events}/>
    </div>
  )
}

export default page