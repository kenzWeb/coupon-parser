import * as cheerio from 'cheerio'
import fs from 'fs'

interface Outcome {
	type: string
	player?: number
	period: string
	set?: string
	over?: boolean
	count?: number
	handicap?: string
}

export interface ParsedData {
	team1: string
	team2: string
	outcome: Outcome
	rate: number
}

export function parseCoupon(filePath: string): ParsedData {
	const html = fs.readFileSync(filePath, 'utf-8')
	const $ = cheerio.load(html)

	const eventDetails = $('.group--hAXBT._event-name--jqpbC').text().trim()
	const [team1, team2] = eventDetails.split('–').map((team) =>
		team
			.replace(/\d+(\.\d+)?/g, '')
			.replace('-й сет', '')
			.replace('(+)', '')
			.replace('(-)', '')
			.replace(':', '')
			.replace(/\n/g, '')
			.replace(/\t/g, '')
			.replace(/\r/g, '')
			.replace(/\s{2,}/g, ' ')
			.trim(),
	)

	const outcome = $('.group--hAXBT:contains("Исход:")')
		.text()
		.trim()
		.replace('Исход:', '')
		.trim()
	const coefficient = $('.group--hAXBT:contains("Коэффициент:")')
		.text()
		.trim()
		.replace('Коэффициент:', '')
	const set = $('.group--hAXBT:not(.title--dyGko)').text().match(/\d+/)?.[0]
	const count = $('.group--hAXBT:not(.title--dyGko)')
		.text()
		.replace(/[^\>\<]+/g, '')
		.trim()
	const param = $('.parameter--h05r6').text().trim()

	const outcomeRes: Outcome = {
		type: '',
		period: '',
	}

	if (outcome.includes('Поб') && !eventDetails.includes('сет')) {
		outcomeRes.type = 'win'
		outcomeRes.player = Number(outcome.match(/\d+/)?.[0])
		outcomeRes.period = 'match'
	} else if (outcome.includes('сет') || eventDetails.includes('сет')) {
		outcomeRes.type = count ? 'handicap' : 'win'
		outcomeRes.player = Number(outcome.match(/\d+/)?.[0])
		outcomeRes.period = 'set'
		outcomeRes.set = set
		if (count) {
			outcomeRes.count = Number(param)
			outcomeRes.over = count === '>'
		}
	} else if (outcome.includes('1') || outcome.includes('2')) {
		outcomeRes.type = 'handicap'
		outcomeRes.period = 'match'
		outcomeRes.player = Number(outcome.match(/\d+/)?.[0])
		if (count) {
			outcomeRes.count = Number(param)
			outcomeRes.over = count === '>'
		} else {
			outcomeRes.handicap = param
		}
	}

	return {
		team1,
		team2,
		outcome: outcomeRes,
		rate: Number(coefficient),
	}
}

const filePath = './src/tests/countMatch/input.html'
const jsonData = parseCoupon(filePath)

console.log(JSON.stringify(jsonData, null, 2))
