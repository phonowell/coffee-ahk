do -> 1
fn = -> 2
do fn
a = do -> 3
b = c: do -> 4
d = do -> do -> -> 5
do -> if a > 1 then 1 else 0
do -> switch a > 1
  when 1 then 0
do -> for a in [1, 2]
  a
do -> return 1