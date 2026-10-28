type NewYearHatProps = { id: string };

export function NewYearHatDefinitions({ id }: NewYearHatProps): React.ReactNode {
  return (
    <defs>
      <linearGradient id={`${id}-party-blue`} x1="0" y1="0" x2="1" y2=".7">
        <stop stopColor="#245C86" />
        <stop offset=".5" stopColor="#123A62" />
        <stop offset="1" stopColor="#08233F" />
      </linearGradient>
      <linearGradient id={`${id}-party-gold`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#FFF0AC" />
        <stop offset=".48" stopColor="#EDC45C" />
        <stop offset="1" stopColor="#AF7E27" />
      </linearGradient>
      <clipPath id={`${id}-party-cone`}>
        <path d="M294 248 L600 -120 Q608 -130 616 -117 L887 225 Q605 338 294 248Z" />
      </clipPath>
    </defs>
  );
}

export function NewYearHatBack({ id }: NewYearHatProps): React.ReactNode {
  return (
    <>
      <g className="bui-sial-new-year-crown">
        <path fill={`url(#${id}-party-blue)`} stroke="#D4AC50" strokeWidth="4" d="M294 248 L600 -120 Q608 -130 616 -117 L887 225 Q605 338 294 248Z" />
        <g clipPath={`url(#${id}-party-cone)`}>
          <path d="M315 169 Q551 211 798 101 M399 54 Q560 96 725 9 M489 -52 Q574 -17 659 -67" fill="none" stroke={`url(#${id}-party-gold)`} strokeWidth="26" />
          <path d="M320 249 L603 -119 L447 274Z" fill="#76B6E0" opacity=".12" />
          <path d="M682 161 l8 18 20 3 -15 14 3 20 -17 -10 -18 9 4 -20 -14 -14 20 -2Z M481 157 l5 12 14 2 -10 9 2 14 -12 -7 -12 6 3 -13 -10 -10 14 -1Z" fill="#F8DB82" />
          <circle cx="571" cy="24" r="6" fill="#FFF0AC" />
          <circle cx="735" cy="235" r="6" fill="#FFF0AC" />
        </g>
        <path className="bui-sial-new-year-star" fill={`url(#${id}-party-gold)`} stroke="#FFF0AC" strokeWidth="2" d="M607 -159 l12 25 28 4 -20 20 5 28 -25 -14 -25 14 5 -28 -20 -20 28 -4Z" />
      </g>
      <path fill="#936C2D" d="M300 270 Q266 233 304 214 L339 233 L325 281Z M863 201 Q909 178 902 226 L875 257Z" />
    </>
  );
}

export function NewYearHatFront({ id }: NewYearHatProps): React.ReactNode {
  return (
    <g>
      <path fill="#123B58" opacity=".18" clipPath={`url(#${id}-head-clip)`} d="M300 250 Q560 340 887 225 L887 251 Q559 367 300 280Z" />
      <path fill={`url(#${id}-party-gold)`} stroke="#B98B36" strokeWidth="2" d="M300 222 C367 252 435 276 538 267 C668 257 755 204 870 191 Q893 188 892 213 L888 242 C786 250 679 306 544 317 C442 325 360 297 305 274 Q289 269 288 250 Q286 232 300 222Z" />
      <path fill="none" stroke="#FFF0AC" strokeWidth="7" strokeLinecap="round" d="M308 234 C390 268 452 288 540 278 C671 268 760 215 874 204" />
      <path fill="none" stroke="#A87A2C" strokeWidth="3" strokeLinecap="round" d="M307 263 Q419 319 544 305 C681 294 784 242 875 233" />
    </g>
  );
}
