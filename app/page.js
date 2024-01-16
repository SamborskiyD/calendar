
import AddButton from "@/components/AddButton"
import Event from "@/components/Event"
import LogOutButton from "@/components/LogOutButton"
import DownloadButton from "@/components/DownloadButton"
import { getEvents } from "@/db/actions"

export default async function Home() {

  let events = await getEvents()

  const calcPositionOfEvents = () => {
    if (!events.error) {
      events = events
        .sort((a, b) => a.start - b.start)
        .map(event => { return { ...event, order: 0 } })


      for (let i = 0; i < events.length; i++) {
        if (i > 0) {
          let prevEventHeight = events[i - 1].start + events[i - 1].duration * 2

          if (prevEventHeight >= events[i].start) {
            events[i].order = events[i - 1].order + 1
          }
        }
      }

      return events
    }
    return []
  }

  const eventsWithPosition = calcPositionOfEvents()


  const hours = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00']

  return (
    <main>
      <div className="w-[90vw] lg:w-[60vw] mt-20 mx-auto">

        <div className="flex gap-4 items-center justify-between border-2 border-darkBlue p-4 mb-2 rounded-t-lg">
          <h1 className=" capitalize text-gray-400 text-lg">{new Date().toLocaleDateString('uk-UA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          <div className="flex flex-wrap justify-end items-center gap-4">
            <LogOutButton />
            <DownloadButton events={eventsWithPosition} />
            <AddButton />
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-scroll relative">
          {hours.map((hour, index) => (
            <div key={index} className=" flex gap-2 h-[60px] border-t border-gray-300 text-gray-300 font-extralight w-full even:border-none even:gap-4 even:text-xs">
              <h1 className="even:text-xs">{hour}</h1>
            </div>
          ))}
          {
            eventsWithPosition?.map((event) => (<Event key={event.id} event={event} />))
          }
        </div>
      </div>
      <div id="modal"></div>
    </main>
  )
}
