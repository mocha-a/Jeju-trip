import Left_black from '../icons/Left_black'

function SearchBar({onSubmit, showBackBtn, placeholder, value, onChange, submitbtn, onClick}) {
  return (
    <form className='searchbar' onSubmit={onSubmit}>
      {showBackBtn && <Left_black className={'search-back'} onClick={() => { onClick() }}/>}
      <input type="text" placeholder={placeholder} 
        value={value} onChange={onChange} name='search' />
      <button type="submit">{submitbtn}</button>
    </form>
  )
}

export default SearchBar