import {useState} from 'react'

function TimelineEvents({timelineEvents, onSendMessage, onTimeSelected}) {
    const [message, setMessage] = useState('')
    const sendMessage = () => {
        onSendMessage(message)
        setMessage('')
    }
    return (
        <div className="timeline-events">
            <div className="timeline-events__list">
                {timelineEvents.map((event, index) => (
                    <div key={index} className="timeline-events__item">
                        <div className="timeline-events__item__author">
                            <a href="#" onClick={(e) => {e.preventDefault();onTimeSelected(event.time);}}>{event.time}</a> - {event.author}
                        </div>
                        <div className="timeline-events__item__message">
                            {event.message}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}></input>
                <button onClick={sendMessage} disabled={message.trim() == ''}>Send</button>
            </div>
        </div>
    )
}

export default TimelineEvents