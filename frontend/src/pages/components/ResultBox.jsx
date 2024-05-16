import React from 'react'

function ResultBox( ) {
  return (
    <div className=" flex bg-[#F5F5F5] justify-center items-center">
      <div className="flex w-[560px] h-[411px] bg-gray-200 rounded-xl shadow-xl justify-center items-center">
        <div>
          <div className='flex items-center gap-2 p-2' >
            <div className="badge badge-grey badge-lg ">1</div>
            <div>Upload your text file </div>
          </div>
          <div className='flex items-center gap-2 p-2'>
            <div className="badge badge-grey badge-lg " style={{lineHeight: '16px'}}>2</div>
            <div>Choose your desired feature function</div>
          </div>

          <div className='flex items-center gap-2 p-2'>
            <div className="badge badge-grey badge-lg ">3</div>
            <div>Find your result</div>
          </div>

        </div>
      </div>

    </div>
    
  )
}

export default ResultBox;