fetch('http://localhost:9000/backend/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token") //add this line to add Authorization to a request
                },
                body: JSON.stringify(data)
            }); //Further response handling


            //implementieren! + ausprobieren