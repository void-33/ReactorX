import React, { useRef, useState, useEffect } from "react";
import { LabItem } from "@/lib/types";

export default function StorageTank({ contents, isHeating }: LabItem) {
    const tankPathRef = useRef<SVGPathElement | null>(null);

    // max capacity of burette
    const MAX_VOLUME = 10000;
    const [bbox, setBBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const content_volume = Math.min((contents?.volume || 0), MAX_VOLUME);
    const fillRatio = content_volume / MAX_VOLUME;



    const contentHeight = Math.max(0, bbox.height * fillRatio );
    const contentY = bbox.y + bbox.height - contentHeight;


    useEffect(() => {
        const update = () => {
            const tankPath = tankPathRef.current
            if (tankPath) {
                const b = tankPath.getBBox();
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
    }, [])
    return (
        <svg width={350} height={350} viewBox="5 10 80 80" fill="#fff">
            <defs>
                <clipPath id="tank-mask">
                    <path d="m43.93 16.192s-8.8705 1.056-12.461 3.3792c-3.5904 2.3232-7.6033 6.5472-7.6033 6.5472s-3.872 4.5056-4.6464 8.3777c-0.77441 3.872-0.98561 5.3504-0.98561 5.3504l53.716 0.0704s0.1408-3.4496-1.4784-7.1105c-1.6192-3.6608-3.0272-7.3217-7.1104-10.49-4.0832-3.168-9.6449-5.0688-12.25-5.632-2.6048-0.5632-7.1809-0.4928-7.1809-0.4928z" />
                    <path d="m18.234 44.916s1.408 8.8001 3.52 10.982c2.112 2.1824 3.4496 4.7872 6.1248 6.336s3.9424 2.6752 3.9424 2.6752 5.4208 2.2528 7.9553 2.464c2.5344 0.2112 2.1824 0.84481 2.1824 0.84481l0.2112-23.655z" />
                    <path d="m47.943 44.775 0.352 23.021s9.9969-2.1824 12.39-4.224c2.3936-2.0416 8.0961-6.4768 8.8705-9.5041 0.7744-3.0272 2.6048-9.5745 2.6048-9.5745z" />
                </clipPath>
            </defs>


            <rect x={bbox.x} y={contentY} width={bbox.width} height={contentHeight} clipPath="url(#tank-mask)" fill="blue" ></rect>

            <path ref={tankPathRef} d="m84.714 77.472h-9.7427v-32.316h3.7686v-5.9399h-5.6169c-1.2913-11.575-10.164-20.938-21.58-23.574v-3.1137h2.1426c0.55225 0 1-0.44775 1-1s-0.44775-1-1-1h-17.371c-0.55225 0-1 0.44775-1 1s0.44775 1 1 1h2.1426v3.1137c-11.416 2.6357-20.289 11.998-21.58 23.574h-5.6169v5.9399h3.769v32.316h-9.7432c-0.55225 0-1 0.44775-1 1s0.44775 1 1 1h79.429c0.55225 0 1-0.44775 1-1s-0.44775-1-1-1zm-44.257-64.943h9.0859v2.7294c-1.4824-0.23389-2.9987-0.36224-4.543-0.36224-1.5443 0-3.0606 0.12836-4.543 0.36224zm4.543 4.3672c13.334 0 24.59 9.7198 26.114 22.32h-52.227c1.5236-12.6 12.78-22.32 26.114-22.32zm-31.74 26.26v-1.9399h63.48v1.9399zm6.9688 34.315h-3.1997v-31.159c0.50769 3.2756 1.6088 6.354 3.1997 9.1318zm21.2 4.89e-4h-19.2v-19.022c4.4665 5.827 11.297 9.8513 19.2 10.806zm0-10.252c-8.3068-1.0786-15.32-5.7833-19.269-12.435-0.02844-0.07715-0.0733-0.14197-0.11896-0.20886-1.6488-2.8391-2.7238-6.026-3.1311-9.4199h22.52zm5.1426 1.1741c6.1e-4 0.01984-0.0081 0.03748-0.0063 0.0575 7.33e-4 8e-3 0.0054 0.01434 0.0063 0.02228v8.9977h-3.1426v-32.315h3.1426zm21.2 9.078h-19.2v-8.2162c7.9036-0.95435 14.734-4.9781 19.2-10.805zm0.06897-22.686c-3.9496 6.6512-10.962 11.354-19.269 12.433v-22.064h22.52c-0.4071 3.3931-1.4816 6.5789-3.1293 9.4172-0.04669 0.06799-0.0921 0.1344-0.12103 0.21314zm5.1312 22.685h-3.2002v-22.027c1.5915-2.7789 2.6927-5.8586 3.2002-9.1359z" />
        </svg>

    );
}