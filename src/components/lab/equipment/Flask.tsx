'use client';

import React,{useRef, useState, useEffect, useEffectEvent} from 'react';
import type { LabItem } from '@/lib/types';

export default function Flask({ contents, isHeating }: LabItem) {
  const flaskPathRef = useRef<SVGPathElement | null> (null);

  // max capacity of flask
  const MAX_VOLUME = 250;

  const content_volume = Math.min((contents?.volume || 0), MAX_VOLUME);
  const fillRatio = content_volume / MAX_VOLUME;


  const [bbox, setBBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  let contentHeight;
  if(fillRatio<=0.75){
    contentHeight = Math.max(0, (bbox.height-110) * (fillRatio/0.75));
  }
  else{
    contentHeight = (bbox.height-110) + Math.max(0,88 * ((fillRatio-0.75)/0.25));
  }
  const contentY = bbox.y + bbox.height - contentHeight;

  useEffect(()=>{
    const update = () => {
      const flaskPath = flaskPathRef.current
      if (flaskPath) {
        const b = flaskPath.getBBox();
        setBBox({
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height
        })
      }
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  },[])



  return (
    <svg width="80" height="120" viewBox="10 40 180 200" fill='#ffffff'>
      <defs>
        <clipPath id='flask-mask'>
          <path d="m82.937 40.324-0.25441 82.173-50.881 93.367s-2.0353 6.1058 1.0176 10.431 8.9042 7.505 8.9042 7.505l125.93-0.12721s8.2682-2.5441 9.9219-7.505c1.6536-4.9609 1.6536-9.9219 1.6536-9.9219l-51.772-92.731 0.12721-83.064z" />
        </clipPath>
      </defs>

      {/* content rect */}
      {/* <rect x={bbox.x} y={contentY} width={bbox.width} height={contentHeight} fill='blue' clipPath='url(#flask-mask)'></rect> */}


      <rect x={bbox.x} y={contentY} width={bbox.width} height={contentHeight} fill='blue' clipPath='url(#flask-mask)'></rect>
      {/* main flask path */}
      <path ref={flaskPathRef} strokeWidth={2.0} d="m180.96 211.17-47.957-84.543c-1.0401-1.8297-1.589-3.9097-1.589-6.0284v-79.526c4.8246-1.2326 8.4072-5.6238 8.4072-10.834 0-6.1632-5.0174-11.181-11.181-11.181h-46.513c-6.1632 0-11.181 5.0174-11.181 11.181 0 5.2099 3.5823 9.6011 8.4168 10.834v79.535c0 2.109-0.54892 4.1987-1.589 6.0284l-47.957 84.533c-3.1489 5.5373-3.1105 12.134 0.09629 17.642 3.2069 5.5085 8.9271 8.7922 15.292 8.7922h120.36c6.375 0 12.095-3.2838 15.302-8.7922 3.2069-5.5085 3.2453-12.105 0.10594-17.642zm-4.8342 14.888c-2.2149 3.804-6.1632 6.0765-10.564 6.0765h-120.36c-4.4011 0-8.3492-2.2727-10.564-6.0765-2.2149-3.804-2.2438-8.3588-0.0674-12.182l5.3255-9.3893h20.502c1.5119 0 2.735-1.223 2.735-2.735s-1.223-2.735-2.735-2.735h-17.392l8.9559-15.784h18.471c1.5119 0 2.735-1.223 2.735-2.735 0-1.5119-1.223-2.735-2.735-2.735h-15.36l9.7744-17.228h17.247c1.5119 0 2.735-1.223 2.735-2.735s-1.223-2.735-2.735-2.735h-14.137l9.5626-16.862h17.652c1.5119 0 2.735-1.223 2.735-2.735s-1.223-2.735-2.735-2.735h-14.551l1.8971-3.3513c1.5119-2.6578 2.3016-5.6818 2.3016-8.7346l0.0096-79.227h29.093c1.5119 0 2.735-1.223 2.735-2.735s-1.223-2.735-2.735-2.735h-31.797c-3.1489 0-5.701-2.5617-5.701-5.701 0-3.1489 2.5617-5.701 5.701-5.701h46.513c3.1393 0 5.701 2.5617 5.701 5.701 0 3.1489-2.5617 5.701-5.701 5.701-1.5119 0-2.735 1.223-2.735 2.735 0 0.13483 0.01 0.26966 0.0289 0.40446v81.518c0 3.0624 0.7993 6.0863 2.3016 8.7346l47.957 84.533c2.1764 3.8232 2.1475 8.3877-0.0674 12.182z" />
    </svg>

  );
}
