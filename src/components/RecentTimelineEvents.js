import {useEffect, useState, useRef} from 'react'

function RecentTimelineEvents({event}) {

    const [current, setCurrent] = useState();
    const currentInterval = useRef(null);
    const queue = useRef([]);

    const processQueue = () => {
        if(queue.current.length){
            let item = queue.current.shift()
            setCurrent(item)
            currentInterval.current = setTimeout(processQueue, 2000)
        }else {
            setCurrent(undefined)
            if(currentInterval.current){
                clearTimeout(currentInterval.current)
                currentInterval.current = undefined
            }
        }
    }

    useEffect(() => {
        if(event){
            queue.current.push(event);
            if(currentInterval.current == null){
                processQueue();
            }
        }
    }, [event])

    return (
        <div className="recent-events">
            {current && <div className="recent-events__item">{current.author || 'Anonymous'}{current.type == 'MESSAGE' ? ':' : ''} {current.message}</div>}
        </div>
    )

}

export default RecentTimelineEvents;