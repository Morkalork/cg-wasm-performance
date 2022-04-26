package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
)

type Person struct {
	Id int `json:"id"`
	Name string `json:"name"`
	Surname string `json:"surname"`
	Age int `json:"age"`
	Email string `json:"email"`
	City string `json:"city"`
	ShirtSize string `json:"shirtSize"`
}

type PersonAnalysis struct {
	AverageAge          float32    	`json: "averageAge"`
	MostCommonShirtSize string 		`json: "mostCommonShirtSize"`
}

func processWithWasmByStream(_ js.Value, args []js.Value) interface{} {
	fileData := args[0] // The uploaded file
	callback := args[1]

	byteArray := make([]uint8, fileData.Get("byteLength").Int())
	js.CopyBytesToGo(byteArray, fileData)

	return processData(string(byteArray), callback)
}

func processWithWasm(_ js.Value, args []js.Value) interface{} {
	jsonString := args[0].String()
	callback := args[1]

	return processData(jsonString, callback)
}

func processData(jsonString string, callback js.Value) interface{} {
	var people []Person
	json.Unmarshal([]byte(jsonString), &people)

	var analysis PersonAnalysis
	totalAge := 0
	sizes := map[string]int{}
	for _, person := range people {
		totalAge = totalAge + person.Age

		shirtSize, isOk := sizes[person.ShirtSize]
		if isOk {
			sizes[person.ShirtSize] = shirtSize + 1
		} else {
			sizes[person.ShirtSize] = 0
		}
	}

	analysis.AverageAge = float32(totalAge / len(people))

	mostCommonSizeCount := 0
	mostCommonsSizeLabel := ""
	for key, shirtSize := range sizes {
		if shirtSize > mostCommonSizeCount {
			mostCommonSizeCount = shirtSize
			mostCommonsSizeLabel = key
		}
	}

	analysis.MostCommonShirtSize = mostCommonsSizeLabel

	analysisString, err := json.Marshal(analysis)
	if err != nil {
		fmt.Println("Could not stringify the analysis data...")
		return nil
	}

	callback.Invoke(string(analysisString))
	return nil
}

func main() {
	js.Global().Set("processWithWasm", js.FuncOf(processWithWasm))
	js.Global().Set("processWithWasmByStream", js.FuncOf(processWithWasmByStream))

	<-make(chan bool)
}