import Button from './Button'
import Emoji from 'a11y-react-emoji'

interface Props {
    showthumpsUp: boolean,
    thumpsUp: any,
    thumpsUpCounter: number,
    onAdd: any,
}
const Header = ({ onAdd, thumpsUp, showthumpsUp, thumpsUpCounter}: Props) => {
    return (
        <header>
            <Button onClick={onAdd}/>
            <Emoji onClick={thumpsUp} symbol="👍" className={showthumpsUp ? 'button is-success' : 'button is-black'}/>
            <p className="is-size-4">{thumpsUpCounter}</p>
        </header>
    )
}

export default Header
