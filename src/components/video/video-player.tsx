"use client"

import { ExternalLink, Maximize, Pause, Play, Volume2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import type { VideoSource } from "@/data/courses"

export default function VideoPlayer({ video }: { video: VideoSource }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (video.provider === "google-drive" && video.url?.includes("/folders/")) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-xl border bg-zinc-950 px-6 text-center text-white shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-white/10"><ExternalLink className="size-6" aria-hidden="true" /></div>
        <div><h2 className="text-lg font-semibold">Course materials are in Google Drive</h2><p className="mt-1 max-w-md text-sm text-white/60">This lesson points to a Drive folder. Open it to access the lesson files and videos.</p></div>
        <Link href={video.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ExternalLink className="size-4" aria-hidden="true" />Open in Google Drive</Link>
      </div>
    )
  }

  if (video.provider === "google-drive" && video.fileId) {
    return <iframe title="Course video" src={`https://drive.google.com/file/d/${video.fileId}/preview`} className="aspect-video w-full rounded-xl border bg-black shadow-sm" allow="autoplay; fullscreen" />
  }

  if (video.provider === "youtube" && video.videoId) {
    return <iframe title="YouTube course video" src={`https://www.youtube-nocookie.com/embed/${video.videoId}${video.startTime ? `?start=${video.startTime}` : ""}`} className="aspect-video w-full rounded-xl border bg-black shadow-sm" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
  }

  if (video.provider === "youtube" && video.playlistId) {
    return <iframe title="YouTube course playlist" src={`https://www.youtube-nocookie.com/embed/videoseries?list=${video.playlistId}`} className="aspect-video w-full rounded-xl border bg-black shadow-sm" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-zinc-950 shadow-sm">
      <div className="relative flex aspect-video items-center justify-center bg-[radial-gradient(circle_at_center,_#3f3f46,_#18181b_60%,_#09090b)]">
        <button type="button" aria-label={isPlaying ? "Pause video" : "Play video"} onClick={() => setIsPlaying((playing) => !playing)} className="flex size-16 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
          {isPlaying ? <Pause className="size-6 fill-current" aria-hidden="true" /> : <Play className="ml-1 size-6 fill-current" aria-hidden="true" />}
        </button>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 text-white">
          <button type="button" aria-label={isPlaying ? "Pause video" : "Play video"} onClick={() => setIsPlaying((playing) => !playing)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Play className="size-4 fill-current" aria-hidden="true" /></button>
          <div className="h-1 flex-1 rounded-full bg-white/25"><div className="h-full w-1/4 rounded-full bg-white" /></div>
          <button type="button" aria-label="Toggle volume" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Volume2 className="size-4" aria-hidden="true" /></button>
          <button type="button" aria-label="Enter fullscreen" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Maximize className="size-4" aria-hidden="true" /></button>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">{video.provider} preview</span>
      </div>
    </div>
  )
}
