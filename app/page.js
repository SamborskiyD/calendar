
import AddButton from "@/components/AddButton"
import Event from "@/components/Event"
import LogOutButton from "@/components/LogOutButton"
import DownloadButton from "@/components/DownloadButton"
import { getEvents } from "@/db/actions"

export default async function Home() {

  const events = await getEvents()

  const hours = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00']

  return (
    <main>
      <div className="w-[60vw] mt-20 mx-auto">

        <div className="flex items-center justify-between border-2 border-darkBlue p-4 mb-2 rounded-t-lg">
          <h1 className=" capitalize text-gray-400 text-lg">{new Date().toLocaleDateString('uk-UA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          <div className="flex items-center gap-4">
            <LogOutButton />
            <DownloadButton events={events} />
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
            events?.map((event) => (<Event key={event.id} event={event} />))
          }
        </div>
      </div>
      <div id="modal"></div>
    </main>
  )
}
