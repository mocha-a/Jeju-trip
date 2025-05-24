
function Button({className, btn, children}) {
    return (
        <div className={`${className} btn`}>{children}{btn}</div>
    )
}

export default Button