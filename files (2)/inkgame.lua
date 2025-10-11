local url = "https://loadstringer.overhub.xyz/scripts/68ea8093592ef5a745c6528f"

local success, result = pcall(function()
    return loadstring(game:HttpGet(url))
end)

if success and result then
    local execSuccess, execResult = pcall(result)
    if execSuccess then
        print("loaded")
    else
        warn("failed", execResult)
    end
else
    warn("❌ Failed url", result)
end
