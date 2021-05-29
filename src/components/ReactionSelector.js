function ReactionSelector({onReaction}) {

    const reactions = ['🤣','😍','😑','😴','🤐','😔','😲','😤','😭']

    return (
        <div className="reactions-selector">
            {reactions.map(emoji => (
                <button onClick={() => onReaction(emoji)}>{emoji}</button>
            ))}
        </div>
    )
}

export default ReactionSelector