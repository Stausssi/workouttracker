interface Props {
    onClick: any,
}
const Button = ({onClick}: Props) => {
    return (            
        <button onClick={onClick}  className='button is-black mr-2' >Add new Comment</button>
    )
}

export default Button

