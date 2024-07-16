const GoogleMapsLink = ({ name } : { name: string }) => {
  const newName = name.replaceAll(' ', '+')
  return (
    <a
      className='text-green-400 underline-offset-auto'
      href={`https://www.google.com/maps/search/?api=1&query=${newName}`}
      target='_blank'
      style={{ textDecoration: 'underline' }}
    >
      {name}
    </a>
  )
}

const ResultsContent = ({ results } : { results: any }) => {
  if (results) {
    const NearbyPlaces = () => {
      if (results.hasNearbyPlaces) {
        return (
          <div>
            <p><b>Nearby places, similar to the picture background:</b></p>
            <br />
            {results.nearbyPlaces.map((item: any) => (
              <div key={item.name}>
                <p>- <GoogleMapsLink name={item.name} />: <i>{item.description}</i></p>
                <br />
              </div>
            ))}
          </div>
        )
      }
      return  (
        <div>
          <p><b>Not too nearby places, similar to the picture background:</b></p>
          <br />
          {results.nearbyPlaces.map((item: any) => (
            <div key={item.name}>
              <p>- <GoogleMapsLink name={item.name} />: <i>{item.description}</i></p>
              <br />
            </div>
          ))}
        </div>
      )
    }
    const SimilarPlaces = () => {
      if (!results.hasNearbyPlaces) {
        return (
          <div>
            <p><b>Other places that might interest you:</b></p>
            <br />
            {results.similarPlaces.map((item: string) =>
              <div key={item}>
                - <GoogleMapsLink name={item} />
                <br />
              </div>
            )}
          </div>
        )
      }
      return null
    }

    const ThingsToDo = () => {
      return (
        <div>
          <p><b>Best season to visit:</b> {results.tips.date}</p>
          <br />
          <p><b>Things to do:</b> </p>
          <ul>
            {results.tips.toDo.map((item: string) => <p key={item}> - {item}</p>)}
          </ul>
          <br />
          <p><b>Recomendations: </b></p>
          <ul>
            {results.tips.recomendations.map((item: string) => <p key={item}> - {item}</p>)}
          </ul>
        </div>
      )
    }

    return (
      <div className='border border-yellow-300 p-4'>
        <h3 className='text-center font-medium text-2xl text-green-400 mb-2'>The Results</h3>
        <NearbyPlaces />
        <br />
        <SimilarPlaces />
        <br />
        <ThingsToDo />
      </div>
    )
  }
  return null
}

export default ResultsContent