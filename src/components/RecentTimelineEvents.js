import {useEffect, useState, useRef} from 'react'

function RecentTimelineEvents({event}) {

    const [current, setCurrent] = useState();
    const currentInterval = useRef(null);
    const queue = useRef([]);

    const processQueue = () => {
        if(queue.current.length){
            let item = queue.current.shift()
            setCurrent(item)
            let time = 1500;
            if(item.type == 'MESSAGE'){
                time = 2000
                if(item.message.length > 15){
                    time = 2500
                }
            }
            currentInterval.current = setTimeout(processQueue, time)
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
            {current && (
                <div className={`recent-events__item ${current.type == 'MESSAGE' ? 'recent-events__item--message' : ''}`}>
                    <span className="recent-event__item__name">{current.author || 'Anonymous'}{current.type == 'MESSAGE' ? ':' : ' '}</span>
                    <span className="recent-event__item__message">{current.message}</span>
                </div>
            )}
        </div>
    )

}

export default RecentTimelineEvents;