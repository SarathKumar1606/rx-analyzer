import { tool } from 'ai';
import { z } from 'zod';

// const GATES = [
//   {
//     id: 'main-gate',
//     name: 'Main Gate',
//     summary: 'Primary entrance for most visitors and students.',
//   },
//   {
//     id: 'kotturpuram-gate',
//     name: 'Kotturpuram Gate',
//     summary: 'Secondary entrance connecting from the Kotturpuram side.',
//   },
// ] as const;

// const TIMINGS = {
//   open: '8:00 AM',
//   close: '4:45 PM',
// } as const;

// const LANDMARKS = {
//   library: 'Proceed from Main Gate along the central road and follow library signage.',
//   adminOffice: 'Enter via Main Gate and head toward the administration block at the center campus zone.',
//   examCell: 'Use Main Gate, continue to the academic block, and follow posted exam cell signs.',
//   workshop: 'Enter from Kotturpuram Gate for a shorter approach to workshop buildings.',
// } as const;

// export const cegTools = {
//   getCampusGates: tool({
//     description: 'Get the official CEG campus entry gates.',
//     inputSchema: z.object({}),
//     execute: async () => ({
//       gates: GATES,
//     }),
//   }),

//   getCollegeTimings: tool({
//     description: 'Get official CEG working timings.',
//     inputSchema: z.object({}),
//     execute: async () => ({
//       timings: TIMINGS,
//     }),
//   }),

//   getCampusDirections: tool({
//     description: 'Get simple directions to a known CEG campus location.',
//     inputSchema: z.object({
//       destination: z
//         .enum(['library', 'adminOffice', 'examCell', 'workshop'])
//         .describe('Campus destination to route to'),
//       gate: z
//         .enum(['main-gate', 'kotturpuram-gate'])
//         .optional()
//         .describe('Preferred entry gate, if known'),
//     }),
//     execute: async ({ destination, gate }) => {
//       const preferredGate = gate ?? 'main-gate';
//       const gateName =
//         preferredGate === 'main-gate' ? 'Main Gate' : 'Kotturpuram Gate';

//       return {
//         destination,
//         recommendedEntry: gateName,
//         directions: LANDMARKS[destination],
//       };
//     },
//   }),
// };



export const getTimeTable = tool({
  description :"Get Latest time table of various classes",
  inputSchema : z.object({
    class: z.coerce.number().int().min(1).max(4).describe("class number (between 1 and 4)"),
    batch: z
      .string()
      .trim()
      .toUpperCase()
      .refine(value => value === 'A' || value === 'B', {
        message: 'Batch must be A or B',
      })
      .describe("batch A or batch B (students from one class are divided into batch a and b)")
  }),
  execute: async ({ class: classNumber, batch }) => {
    const timetable: Record<
      number,
      Record<string, string[]>
    > = {
      1: {
        A: ["8:30-9:30 DSA", "10:30-11:30 OOP"],
        B: ["9:30-10:30 Math", "11:30-12:30 Physics"],
      },
      2: {
        A: ["8:30-9:30 DBMS", "10:30-11:30 OS"],
        B: ["9:30-10:30 English", "11:30-12:30 Chemistry"],
      },
      3: {
        A: ["8:30-9:30 Networks", "10:30-11:30 AI"],
        B: ["9:30-10:30 History", "11:30-12:30 Geography"],
      },
      4: {
        A: ["8:30-9:30 ML", "10:30-11:30 Ethics"],
        B: ["9:30-10:30 Art", "11:30-12:30 PE"],
      },
    };

    const classData = timetable[classNumber];
    if (!classData) {
      return [`No timetable found for class ${classNumber}`];
    }
    const batchUpper = (batch || '').toUpperCase();
    if (!classData[batchUpper]) {
      return [`No timetable found for class ${classNumber} batch ${batch}`];
    }
    return classData[batchUpper];
  }
})
