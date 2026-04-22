'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type StepStatus = 'done' | 'running' | 'pending'

interface AgentStep { label: string; status: StepStatus }
interface AgentCard  { name: string; type: string; steps: AgentStep[]; stat: string; time: string }

const CARDS: AgentCard[] = [
  {
    name: 'Invoice Processing',
    type: 'Document Agent',
    steps: [
      { label: 'Extract invoice fields', status: 'done' },
      { label: 'Match to PO #A4821',     status: 'done' },
      { label: 'Post to SAP ERP',        status: 'running' },
      { label: 'Notify approver',        status: 'pending' },
    ],
    stat: '1,247 runs',
    time: '8.3s avg',
  },
  {
    name: 'Risk Guard',
    type: 'Governance Agent',
    steps: [
      { label: 'Scan for PII',           status: 'done' },
      { label: 'Check prompt injection', status: 'done' },
      { label: 'Evaluate hallucination', status: 'running' },
      { label: 'Return verdict',         status: 'pending' },
    ],
    stat: '98,431 checks',
    time: '0.4s avg',
  },
  {
    name: 'Approval Workflow',
    type: 'Orchestration Agent',
    steps: [
      { label: 'Route to approver',   status: 'done' },
      { label: 'Check SLA threshold', status: 'done' },
      { label: 'Escalate via Slack',  status: 'running' },
      { label: 'Update CRM record',   status: 'pending' },
    ],
    stat: '2,891 workflows',
    time: '4.1m avg',
  },
]

const PILLARS = [
  { num: '01', title: 'AI Agents',          body: 'Autonomous systems that execute real tasks: document processing, decision routing, content review. No human bottlenecks.' },
  { num: '02', title: 'Execution Systems',  body: 'End-to-end AI workflows that connect to your data, tools, and logic. Deployed in your environment. Runs like infrastructure.' },
  { num: '03', title: 'Governance Layer',   body: 'Safety and auditability built in from day one. PII detection, injection guard, audit trails. Not bolted on. Not an afterthought.' },
]

function StatusIcon({ s }: { s: StepStatus }) {
  if (s === 'done') return (
    <span className="w-4 h-4 rounded-full bg-[#22C55E]/[0.12] border border-[#22C55E]/30 flex items-center justify-center shrink-0">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 4l2 2 4-4" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
  if (s === 'running') return (
    <span className="w-4 h-4 rounded-full border border-accent/50 flex items-center justify-center shrink-0 animate-spin-slow">
      <span className="w-1 h-1 rounded-full bg-accent" />
    </span>
  )
  return <span className="w-4 h-4 rounded-full border border-white/[0.07] shrink-0" />
}

function Card({ c }: { c: AgentCard }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[15px] font-semibold text-[#F5F5F5] leading-tight">{c.name}</p>
          <p className="text-[11px] text-[#8A8A8A] mt-0.5">{c.type}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-live-dot" />
          <span className="text-[10px] text-[#22C55E] font-semibold tracking-wider">LIVE</span>
        </div>
      </div>
      <div className="space-y-2.5 flex-1">
        {c.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <StatusIcon s={step.status} />
            <span className={`text-[13px] leading-tight ${
              step.status === 'done'    ? 'text-[#666]' :
              step.status === 'running' ? 'text-[#F5F5F5] font-medium' :
              'text-[#333]'
            }`}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span className="text-[11px] text-[#777]">{c.stat}</span>
        <span className="text-[11px] font-mono text-accent">{c.time}</span>
      </div>
    </div>
  )
}

export default function WhatWeBuild() {
  const [cards] = useState(CARDS)
  return (
    <section className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="w-8 h-[2px] bg-accent mb-2" />
          <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">What We Build</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight">
              Real systems.<br />Running now.
            </h2>
            <p className="text-[15px] text-[#A3A3A3] leading-relaxed max-w-xs">
              Not wireframes. Not prototypes.
              <br />Production agents, live in enterprise environments.
            </p>
          </div>
        </motion.div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {cards.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }}>
              <Card c={c} />
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((p, i) => (
            <motion.div key={p.num} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0D0D0D] p-6"
            >
              <span className="text-[11px] font-bold text-accent tracking-widest">[{p.num}]</span>
              <h3 className="text-[18px] font-bold text-[#F5F5F5] mt-3 mb-2">{p.title}</h3>
              <p className="text-[14px] text-[#A3A3A3] leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
