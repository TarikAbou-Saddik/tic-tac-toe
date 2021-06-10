import './Header.css';

const Header = () => {
  return (
    <header>
      <h1 className='title'>
        <a href='/'>Tic Tac Toe</a>
      </h1>
      <p className='subtitle'>
        Play against the computer, local with a friend or online!
      </p>
    </header>
  );
};

export default Header;
