#!/bin/zsh
# Rebuild the short card previews in uploads/previews/ from the full videos in uploads/.
# Uses macOS's built-in avconvert (no ffmpeg needed). Output: first 8 s, ~1–2 MB each.
#
#   tools/make-previews.sh                 # all videos
#   tools/make-previews.sh "Film - Pualam"  # one video (name without .mp4)
#
# Want a different part of the video? Add --start <seconds> to the avconvert line.
#
# Examples with a live demo keep only their preview + poster; their full videos were removed
# (still in git history: git show <commit>^:"uploads/Film - Pualam.mp4" > uploads/...). Restore one
# temporarily if its preview must be rebuilt.
cd "${0:A:h}/.."
mkdir -p uploads/previews
if (( $# )); then files=("${@/#/uploads/}"); files=("${files[@]/%/.mp4}"); else files=(uploads/*.mp4); fi
for f in "${files[@]}"; do
  n=${f:t}
  avconvert -s "$f" -p Preset640x480 -o "uploads/previews/$n" --duration 8 --replace >/dev/null 2>&1 \
    && echo "ok   $n" || echo "FAIL $n"
done
du -sh uploads/previews
