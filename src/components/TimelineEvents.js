import {useState} from 'react'

function TimelineEvents({timelineEvents, onSendMessage, onTimeSelected}) {
    const [message, setMessage] = useState('')
    const sendMessage = (e) => {
        e.preventDefault()
        onSendMessage(message)
        setMessage('')
    }
    return (
        <div className="timeline-events">
            <div className="timeline-events__list">
                {timelineEvents.filter(e => e.type == 'MESSAGE').map((event, index) => (
                    <div key={index} className="timeline-events__item">
                        <div className="timeline-events__item__author">
                            {false && (<a href="#" onClick={(e) => {e.preventDefault();onTimeSelected(event.time);}}>{event.time}</a>)}{event.author}
                        </div>
                        <div className="timeline-events__item__message">
                            {event.message}
                        </div>
                    </div>
                ))}
            </div>
            
            <form className="input-group mt-3" onSubmit={sendMessage}>
                <input className="form-control" type="text" value={message} onChange={(e) => setMessage(e.target.value)}></input>
                <button type="submit" className="btn btn-primary" disabled={message.trim() == ''}>Send</button>
            </form>
        </div>
    )
}

export default TimelineEvents