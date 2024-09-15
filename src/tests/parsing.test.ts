import fs from 'fs'
import path from 'path'
import {parseCoupon} from '../parser' // Adjust this import path as needed

interface ParsedData {
	team1: string
	team2: string
	outcome: {
		type: string
		period: string
		player?: number
		set?: string
		over?: boolean
		count?: number
	}
	rate: number
}

describe('Парсинг купонов', () => {
	const testCases = [
		{
			name: 'win match',
			inputFile: 'winMatch/input.html',
			expectedOutput: 'winMatch/output.json',
		},
		{
			name: 'win set',
			inputFile: 'winMatchSet/input.html',
			expectedOutput: 'winMatchSet/output.json',
		},
		{
			name: 'total match',
			inputFile: 'countMatch/input.html',
			expectedOutput: 'countMatch/output.json',
		},
		{
			name: 'total set',
			inputFile: 'countSet/input.html',
			expectedOutput: 'countSet/output.json',
		},
		{
			name: 'handicap match',
			inputFile: 'handicapMatch/input.html',
			expectedOutput: 'handicapMatch/output.json',
		},
		{
			name: 'handicap set',
			inputFile: 'handicapSet/input.html',
			expectedOutput: 'handicapSet/output.json',
		},
	]

	testCases.forEach(({name, inputFile, expectedOutput}) => {
		test(`parses ${name} correctly`, () => {
			const inputPath = path.join(__dirname, '', inputFile)
			const expectedOutputPath = path.join(__dirname, '', expectedOutput)

			const result = parseCoupon(inputPath)
			const expected: ParsedData = JSON.parse(
				fs.readFileSync(expectedOutputPath, 'utf-8'),
			)

			expect(result).toEqual(expected)
		})
	})
})
