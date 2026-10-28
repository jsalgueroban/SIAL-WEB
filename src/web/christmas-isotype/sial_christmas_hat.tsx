type ChristmasHatProps = { id: string };

export function ChristmasHatDefinitions({ id }: ChristmasHatProps): React.ReactNode {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F76265" />
          <stop offset=".4" stopColor="#DA3044" />
          <stop offset="1" stopColor="#A71F38" />
        </linearGradient>
        <linearGradient id={`${id}-fur`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset=".65" stopColor="#EFF7FA" />
          <stop offset="1" stopColor="#C9DFEA" />
        </linearGradient>
      </defs>
    </>
  );
}

export function ChristmasHatBack({ id }: ChristmasHatProps): React.ReactNode {
  return (
    <>
      <g id={`${id}-hat-back`} transform="translate(300 -220) scale(1.85) rotate(-8 150 270)">
        <g className="bui-sial-christmas-crown">
          <g transform="translate(0 94.5) scale(1 .65)">
            <path fill="#A71F38" d="M220 175 Q285 191 322 290 L232 290Z" />
            <path className="body" fill={`url(#${id}-cloth)`} d="M-15 278 C-22 207 40 110 119 63 C163 28 213 35 249 62 C301 100 330 168 346 232 C359 283 361 327 352 369 L319 373 C327 317 304 251 266 213 C252 200 240 192 228 185 C247 218 267 248 281 279 Q151 299 18 278Z" />
            <path fill="#FF8585" opacity=".32" d="M31 264 C50 176 83 101 132 69 Q174 44 208 59 C139 69 100 144 77 222 L69 278Z" />
            <path fill="#971D31" opacity=".65" d="M215 110 C212 150 223 179 247 214 L281 279 L242 283 C233 236 209 205 204 171 Q201 137 215 110Z" />
            <path fill="#AA2032" opacity=".5" d="M263 88 C316 155 346 277 335 370 L352 369 C365 306 351 233 330 183 C311 139 289 107 263 88Z" />
            <path d="M97 239 Q102 205 119 180 M141 268 Q145 240 157 224" fill="none" stroke="#FF9391" strokeWidth="4" strokeLinecap="round" opacity=".4" />
            <path d="M271 225 Q304 268 310 311" fill="none" stroke="#9F2034" strokeWidth="5" opacity=".45" strokeLinecap="round" />
            <g className="pom" transform="translate(0 -205.15) scale(1 1.53846)">
              <path fill={`url(#${id}-fur)`} stroke="#D3E0E4" strokeWidth="2" d="M322 351 Q333 341 345 349 Q361 346 368 361 Q382 369 375 384 Q376 401 361 406 Q346 419 331 409 Q314 411 309 396 Q296 385 304 370 Q305 355 322 351Z" />
              <path fill="#B9CED7" opacity=".55" d="M309 389 Q340 414 370 383 Q370 407 348 410 Q321 416 309 389Z" />
              <path d="M317 370 Q326 357 339 358" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" />
              <path d="m321 386 4 4m21-19 4 3m10 19-5 4" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>
      <path fill="#ADC4D0" d="M300 270 Q266 233 304 214 L339 233 L325 281Z M863 201 Q909 178 902 226 L875 257Z" />
    </>
  );
}

export function ChristmasHatFront({ id }: ChristmasHatProps): React.ReactNode {
  return (
    <>
      <g id={`${id}-hat-front`}>
        <path fill="#123B58" opacity=".18" clipPath={`url(#${id}-head-clip)`} d="M300 250 Q560 340 887 225 L887 251 Q559 367 300 280Z" />
        <path fill={`url(#${id}-fur)`} stroke="#C2D6E0" strokeWidth="2" d="M300 222 C367 252 435 276 538 267 C668 257 755 204 870 191 Q893 188 892 213 L888 242 C786 250 679 306 544 317 C442 325 360 297 305 274 Q289 269 288 250 Q286 232 300 222Z" />
        <path fill="none" stroke="#FFF" strokeWidth="9" strokeLinecap="round" d="M308 234 C390 268 452 288 540 278 C671 268 760 215 874 204" />
        <path fill="none" stroke="#B8CFDB" strokeWidth="4" strokeLinecap="round" d="M307 263 Q419 319 544 305 C681 294 784 242 875 233" />
      </g>
    </>
  );
}
