export const jsxCode = `
<div
  className='some-class'
  onMouseOver={() => { throw new Error('hi') }}
  onClick={() => {
    console.log('hi');
  }}
>
  <time dateTime={event.datetime}>{event.time}</time>
  {true ? <p>one</p> : <p>two</p>}
  {false ? (
    <p>example</p>
  ) : (
    <p>test</p>
  )}
</div>`
