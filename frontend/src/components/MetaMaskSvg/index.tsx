interface MetaMaskProps {
  className?: string
}
  

export default function MetaMaskSvg({ className }: MetaMaskProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path fill="url(#pattern0_274_143)" d="M0 0H32V32H0z" />
      <defs>
        <pattern
          id="pattern0_274_143"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <use xlinkHref="#image0_274_143" transform="scale(.02083)" />
        </pattern>
        <image
          id="image0_274_143"
          width={48}
          height={48}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  )
}