
    // grabbing and formatting this ↑ canvas element 
    const cnv_0 = document.getElementById (`rapid_notes`)
    cnv_0.width = cnv_0.parentNode.scrollWidth
    cnv_0.height = cnv_0.width * 9 / 16
    cnv_0.style.backgroundColor = 'orange'

    // making an array of midi notes
    const notes = [ 62, 66, 69, 73, 74, 73, 69, 66 ]

    // declaring a mutable iterator
    let i = 0

    // declaring a mutable state value
    let running = false

    // declaring a mutable variable for 
    // the period of time between notes
    let period = 200

    // declaring a mutable variable for
    // the length of the note
    let len = 0

    // declaring a function that plays the next note
    function next_note () {

        // use the iterator to select a note from 
        // the notes array and pass it to the 
        // play_note function along with the 
        // len variable to specify the length of the note
        play_note (notes[i], len)

        // iterate the iterator
        i++

        // if i gets too big
        // cycle back to 0
        i %= notes.length
    }

    // this is a recursive function
    function note_player () {

        // play the next note
        next_note ()

        // if running is true
        // it uses setTimeout to call itself 
        // after period milliseconds
        if (running) setTimeout (note_player, period)
    }

    // this function handles the mouse event
    // when the cursor enters the canvas
    cnv_0.onpointerenter = e => {

        // set running to true
        running = true

        // initiate the recurseive note_player function
        note_player ()
    }

    // this function handles the mouse event
    // when the cursor moves over the canvas
    cnv_0.onpointermove = e => {

        // as the cursor goes from left to right
        // len gos from 0 to 5
        len = 5 * e.offsetX / cnv_0.width

        // as the cursor goes from bottom to top
        // period goes from 420 to 20 (milliseconds)
        period = 20 + ((e.offsetY / cnv_0.height) ** 2) * 400
    }

    // this function handles the mouse event
    // when the cursor leaves the canvas
    cnv_0.onpointerleave = e => {

        // set running to false
        running = false
    }