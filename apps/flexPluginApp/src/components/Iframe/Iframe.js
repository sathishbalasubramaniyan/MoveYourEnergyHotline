import React from 'react'

const Iframe = (props) => {
  return (
    <div>
        <iframe height={props.height} width={props.width} src={props.source} title="Bing" ></iframe>
    </div>
  )
}

export default Iframe