import { L, type Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "playtorium",
    when: L("2026", "2026"),
    span: L("4 months", "4 เดือน"),
    role: L("Software Tester", "Software Tester"),
    org: "Playtorium Solutions",
    tag: L("Summer intern → part-time", "ฝึกงานซัมเมอร์ → พาร์ทไทม์"),
    text: L("Wrote and ran manual and automated test cases, tracked defects, and was offered a part-time extension after the internship.", "เขียนและรัน test case ทั้งแบบเทสต์เองและแบบสคริปต์ ตามบั๊กจนปิด พอฝึกงานจบ บริษัทชวนทำพาร์ทไทม์ต่อ"),
    tech: ["Playwright", "Test cases", "Defect tracking"],
    detail: {
      summary: L("I joined as a summer intern in software testing. I tested systems by hand and with automated scripts, and reported what I found.", "ไปฝึกงานซัมเมอร์ในตำแหน่ง Software Tester เทสต์ระบบทั้งแบบทำมือและแบบสคริปต์ แล้วรายงานสิ่งที่เจอ"),
      did: [
        L("Wrote manual test cases from requirements: normal flows, edge cases and error cases.", "เขียน test case จาก requirement ทั้งเคสปกติ เคสขอบ และเคสที่ต้อง error"),
        L("Turned repeatable checks into automated test scripts so they can run again in seconds.", "อะไรที่ต้องเช็กซ้ำบ่อยๆ ก็เขียนเป็นสคริปต์ รันใหม่ได้ในไม่กี่วินาที"),
        L("Logged every defect with steps to reproduce, then re-tested after the fix.", "บันทึกบั๊กทุกตัวพร้อมขั้นตอนทำซ้ำ แก้เสร็จแล้วก็เทสต์ซ้ำ"),
        L("Was offered a part-time extension after the 4-month internship.", "ฝึกครบ 4 เดือน บริษัทชวนทำพาร์ทไทม์ต่อ"),
      ],
      flowTitle: L("Testing workflow", "ขั้นตอนการเทสต์"),
      flow: [
        L("Read the requirement", "อ่าน requirement"),
        L("Write test cases", "เขียน test case"),
        L("Run manually", "เทสต์เอง"),
        L("Automate the repeatable ones", "ตัวที่ต้องรันซ้ำ เขียนสคริปต์"),
        L("Log defects", "บันทึกบั๊ก"),
        L("Re-test the fix", "เทสต์ซ้ำหลังแก้"),
      ],
      loop: true,
      phases: [
        { when: L("Start", "เริ่ม"), what: L("Joined as a summer intern in software testing.", "เข้าฝึกงานซัมเมอร์ ตำแหน่ง Software Tester") },
        { when: L("During", "ระหว่างฝึกงาน"), what: L("Wrote and ran manual and automated test cases; tracked defects.", "เขียนและรัน test case ทั้งเทสต์เองและสคริปต์ ตามบั๊ก") },
        { when: L("Month 4", "เดือนที่ 4"), what: L("Internship complete (4 months in total).", "ฝึกงานครบ (รวม 4 เดือน)") },
        { when: L("After", "หลังจากนั้น"), what: L("Offered a part-time extension.", "บริษัทชวนทำพาร์ทไทม์ต่อ") },
      ],
    },
  },
  {
    id: "ditto",
    when: L("Summer 2025", "ซัมเมอร์ 2025"),
    span: L("3 months", "3 เดือน"),
    role: L("Business Analyst Trainee", "Business Analyst Trainee"),
    org: "Ditto (Thailand)",
    tag: L("Summer · plus part-time developer", "ซัมเมอร์ + พาร์ทไทม์สาย Dev"),
    text: L("Turned business requirements into process workflows that bridged stakeholders and developers, while working part-time as a developer.", "วิเคราะห์ความต้องการของฝ่ายธุรกิจแล้ววาดเป็น workflow ให้ทีม Dev กับฝ่ายธุรกิจเข้าใจตรงกัน ขณะเดียวกันก็ทำพาร์ทไทม์เป็น Developer ด้วย"),
    tech: ["Requirements", "Workflows", "Stakeholders"],
    detail: {
      summary: L("As a business analyst trainee I worked out what stakeholders needed, drew process workflows for the developers, and also worked part-time as a developer.", "ฝึกงานเป็น Business Analyst คอยถามว่าฝ่ายธุรกิจต้องการอะไร วาด workflow ให้ทีม Dev และทำพาร์ทไทม์เป็น Developer ไปด้วย"),
      did: [
        L("Analysed business requirements and clarified what stakeholders really needed.", "วิเคราะห์ requirement จากฝ่ายธุรกิจ และถามจนรู้ว่าต้องการอะไรกันแน่"),
        L("Designed process workflows so developers and business teams shared one picture.", "วาด workflow ให้ฝ่ายธุรกิจกับทีม Dev เห็นภาพเดียวกัน"),
        L("Bridged communication between stakeholders and developers.", "เป็นตัวกลางคุยระหว่างฝ่ายธุรกิจกับ Dev"),
        L("Worked part-time as a developer at the same time.", "ช่วงเดียวกันก็ทำพาร์ทไทม์เป็น Developer"),
      ],
      flowTitle: L("From request to feature", "จากความต้องการสู่ฟีเจอร์"),
      flow: [
        L("Stakeholder need", "ฝ่ายธุรกิจอยากได้อะไร"),
        L("Analyse requirements", "วิเคราะห์ requirement"),
        L("Design process workflow", "วาด workflow"),
        L("Hand over to developers", "ส่งต่อทีม Dev"),
        L("Review the result", "เช็กผลงานที่ได้"),
      ],
      loop: true,
      phases: [
        { when: L("Summer 2025", "ซัมเมอร์ 2025"), what: L("3-month Business Analyst traineeship.", "ฝึกงานเป็น Business Analyst 3 เดือน") },
        { when: L("In parallel", "ในเวลาเดียวกัน"), what: L("Part-time developer role during the same period.", "ทำพาร์ทไทม์เป็น Developer ไปด้วย") },
      ],
    },
  },
  {
    id: "team",
    when: L("Summer 2025", "ซัมเมอร์ 2025"),
    span: L("Short-term project", "โปรเจกต์สั้น"),
    role: L("Developer Trainee", "Developer Trainee"),
    org: "TEAM Consulting Engineering and Management",
    tag: L("Part-time", "พาร์ทไทม์"),
    text: L("Helped code, debug and document software modules for an internal engineering project.", "ช่วยเขียนโค้ด ดีบั๊ก และเขียนเอกสารโมดูลของโปรเจกต์วิศวกรรมภายในบริษัท"),
    tech: ["Coding", "Debugging", "Documentation"],
    detail: {
      summary: L("A short part-time project at an engineering consultancy. I wrote, debugged and documented modules for an internal software tool.", "โปรเจกต์พาร์ทไทม์สั้นๆ ที่บริษัทที่ปรึกษาวิศวกรรม เขียนโค้ด ดีบั๊ก และเขียนเอกสารโมดูลของเครื่องมือภายใน"),
      did: [
        L("Coded software modules for an internal engineering project.", "เขียนโมดูลให้โปรเจกต์วิศวกรรมภายใน"),
        L("Debugged issues found during development.", "ดีบั๊กปัญหาที่เจอระหว่างทำ"),
        L("Documented the modules so others could maintain them.", "เขียนเอกสารโมดูล คนอื่นจะได้รับช่วงต่อได้"),
      ],
      flowTitle: L("Module lifecycle", "วงจรของแต่ละโมดูล"),
      flow: [L("Take a task", "รับงาน"), L("Code the module", "เขียนโมดูล"), L("Debug", "ดีบั๊ก"), L("Document", "เขียนเอกสาร"), L("Hand over", "ส่งมอบ")],
      phases: [
        { when: L("Summer 2025", "ซัมเมอร์ 2025"), what: L("Short-term, part-time internal engineering project.", "โปรเจกต์สั้นๆ ภายในบริษัท แบบพาร์ทไทม์") },
      ],
    },
  },
];
