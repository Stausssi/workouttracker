interface Props {
    onClick: any,
}
//ad new comment button
const Button = ({onClick}: Props) => {
    return (            
        <button onClick={onClick}  className='button is-black mr-2' >Add new Comment</button>
    )
}

export default Button

