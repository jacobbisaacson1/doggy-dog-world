import React, { useState, useEffect } from 'react'
import AddParkForm from '../AddParkForm'
import ParkList from '../ParkList'
import EditParkModal from '../EditParkModal'

export default function ParkContainer() {
  const [parks, setParks] = useState([])
  const [idOfParkToEdit, setIdOfParkToEdit] = useState(-1)

  useEffect(() => {
    getParks()
  }, [])

  const getParks = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "/api/v1/parks/"
      const parksResponse = await fetch(url, {
        credentials: 'include'
      })
      const parksJson = await parksResponse.json()
      setParks(parksJson.data)
    } catch(err) {
      console.error("Error getting PARK data.", err)
    }
  }

  const deletePark = async (idOfParkToDelete) => {
    const url = process.env.REACT_APP_API_URL + "/api/v1/parks/" + idOfParkToDelete
    try {
      const deleteParkResponse = await fetch(url, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteParkResponse.status === 200) {
        setParks(parks.filter(park => park.id !== idOfParkToDelete))
      }
    } catch(err) {
      console.error("Error deleting PARK:");
      console.error(err);
    }
  }

  const createPark = async (parkToAdd) => {

    try {
      const url = process.env.REACT_APP_API_URL + "/api/v1/parks/"
      const createParkResponse = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parkToAdd)
      })
      const createParkJson = await createParkResponse.json()
      if(createParkResponse.status === 201) {
        setParks([...parks, createParkJson.data])
      } 
    } catch(err) {
      console.error("Error adding PARK")
      console.error(err)
    }
  } //create PARK

  const editPark = (idOfParkToEdit) => setIdOfParkToEdit(idOfParkToEdit)
  const updatePark = async (updatedParkInfo) => {
    const url = process.env.REACT_APP_API_URL + "/api/v1/parks/" + idOfParkToEdit
    try {
      const updateParkResponse = await fetch(url, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(updatedParkInfo), 
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const updateParkJson = await updateParkResponse.json()

      if(updateParkResponse.status === 200) {
        const indexOfParkBeingUpdated = parks.findIndex(park => park.id === idOfParkToEdit)
        parks[indexOfParkBeingUpdated] = updateParkJson.data
        setParks(parks)
        setIdOfParkToEdit(-1)
      }

    } catch(err) {
      console.error("Error updating PARK info")
      console.error(err)
    }

  }// updateDog

  const closeModal = () => setIdOfParkToEdit(-1)

  return(
    <React.Fragment>
      <h2>DOG PARKS!</h2>
      <AddParkForm createPark={createPark} />
      <ParkList 
        parks={parks} 
        deletePark={deletePark}
        editPark={editPark}
      />
      { 
        idOfParkToEdit !== -1 
        && 
        <EditParkModal 
          key={idOfParkToEdit}
          parkToEdit={parks.find((park) => park.id === idOfParkToEdit)}
          updatePark={updatePark}
          closeModal={closeModal}
        /> 
      }
    </React.Fragment>
  )
} // Component




