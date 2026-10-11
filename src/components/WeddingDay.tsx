import { useState } from 'react'
import { wedding } from '../data/wedding'

export default function WeddingDay() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedMoment = wedding.day[selectedIndex]

  return (
    <section
      id="unser-tag"
      aria-labelledby="day-title"
      className="section-space rose-section px-4 md:px-6"
    >
      <div className="page-width mx-auto">
        <div className="text-center mb-6">
          <h2 id="day-title" className="section-title mt-3 mb-3">
            Ein Tag fürs <em>Herz.</em>
          </h2>
        </div>
        <div className="grid align-items-center">
          <div className="col-12 md:col-7 md:pr-5">
            <figure
              id="day-moment-image"
              className="day-moment-visual relative overflow-hidden m-0"
              style={{ height: '650px', minHeight: '600px', width: '100%' }}
            >
              <img
                key={selectedIndex}
                src={selectedMoment.image}
                alt={selectedMoment.imageAlt}
                className="day-moment-image w-full h-full"
                style={{ objectPosition: selectedMoment.imagePosition }}
              />
              <figcaption className="day-moment-caption absolute left-0 bottom-0 m-3 px-3 py-2 border-round-lg">
                <span className="eyebrow">MOMENT 0{selectedIndex + 1}</span>
                <strong className="editorial text-xl font-normal block mt-1">
                  {selectedMoment.title}
                </strong>
              </figcaption>
            </figure>
          </div>
          <div className="col-12 md:col-5 pt-5 md:pt-0">
            <ol className="list-none p-0 m-0">
              {wedding.day.map((item, index) => {
                const active = selectedIndex === index
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      className={`day-moment-button flex gap-4 w-full text-left border-none border-round-xl p-3 ${active ? 'is-active' : ''}`}
                      aria-pressed={active}
                      aria-controls="day-moment-image"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onFocus={() => setSelectedIndex(index)}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span className="flex flex-column align-items-center">
                        <span className="timeline-dot flex align-items-center justify-content-center flex-shrink-0">
                          <i className={`pi ${item.icon}`} aria-hidden="true" />
                        </span>
                        {index < wedding.day.length - 1 && (
                          <span className="timeline-line flex-1" />
                        )}
                      </span>
                      <span className="pb-4">
                        <span className="eyebrow">MOMENT 0{index + 1}</span>
                        <span className="editorial text-2xl font-normal block mt-2 mb-2">
                          {item.title}
                        </span>
                        {/* <span className="muted line-height-3 block">
                          {item.text}
                        </span> */}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
