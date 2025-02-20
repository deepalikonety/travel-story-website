import React from 'react'

const EmptyCards = ({imgSrc,message}) => {
  return (
    <div className='flex flex-col items-center justify-centermt-20 '>
      <img src={imgSrc} alt="No notes" className="w-24" />

      <p className='w-1/2 text-sm font-medium text-slate-600/50 text-center leading mt-5' >
      
      {message}
      </p>

    </div>
  )
}

export default EmptyCards