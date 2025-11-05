import React from 'react'

export default function BrushStyle() {
  return (
    <div className='grid grid-cols-2 bg-gray-700 rounded-lg p-4 gap-2 shadow-lg w-40 h-40'>
        <div className='flex flex-col items-center'>
            <img src="pencil.svg" alt="pencil" className='h-12' />
            <img src="rectangle.svg" alt="rectangle" className='h-12' />
            <img src="circle.svg" alt="circle" className='h-12' />
        </div>
        <div className='flex flex-col items-center gap-8 '>
            <p>Pencil</p>
            <p>Rectangle</p>
            <p>Circle</p>
        </div>
    </div>
  )
}