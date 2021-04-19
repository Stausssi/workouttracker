import Button from './Button'
import Emoji from 'a11y-react-emoji'
//import ButtonThumpsUp from './ButtonThumpsUp'
interface Props {
    title: string,
    showthumpsUp: boolean,
    thumpsUp: any,
    thumpsUpCounter: number,
    onAdd: any,
}
const Header = ({title, onAdd, thumpsUp, showthumpsUp, thumpsUpCounter}: Props) => {
    return (
        <header style={style}>
            <h1>{title}</h1>
            <Button onClick={onAdd}/>
            <Emoji onClick={thumpsUp} symbol="👍"  className={showthumpsUp ? 'button is-success' : 'button is-black'}/>
            <p className="is-size-4">{thumpsUpCounter}</p>
        </header>
    )
}

Header.defaultProps = {
    title: 'Actual Activity in the Feed'
}

const style = {
    color: 'white', 
    backgroundColor: 'gray',
}

export default Header
