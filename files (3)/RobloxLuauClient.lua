-- Roblox Luau script for user verification via Vercel API

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- CHANGE THIS to your deployment URL (no trailing slash)
local VERCEL_BASE_URL = "https://your-vercel-app-url.vercel.app"

local polling = false
local pollConnection = nil
local taskId = nil
local key = nil

-- UI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "VerificationGui"
ScreenGui.Parent = player:WaitForChild("PlayerGui")

local Button = Instance.new("TextButton")
Button.Size = UDim2.new(0, 200, 0, 50)
Button.Position = UDim2.new(0.5, -100, 0.4, 0)
Button.Text = "Start Verification"
Button.Parent = ScreenGui

local StatusLabel = Instance.new("TextLabel")
StatusLabel.Size = UDim2.new(0, 400, 0, 40)
StatusLabel.Position = UDim2.new(0.5, -200, 0.5, 0)
StatusLabel.Text = "Idle"
StatusLabel.Parent = ScreenGui

-- Polling function
local function pollStatus()
    while polling do
        local url = VERCEL_BASE_URL .. "/api/get-status?taskId=" .. taskId
        local success, response = pcall(function()
            return HttpService:GetAsync(url)
        end)
        if success then
            local data = HttpService:JSONDecode(response)
            if data.status == "completed" then
                key = data.key
                StatusLabel.Text = "Verification Complete!"
                polling = false
                RunMainScript(key)
                break
            else
                StatusLabel.Text = "Waiting for verification..."
            end
        else
            StatusLabel.Text = "Network error"
        end
        wait(5)
    end
end

-- Button click logic
Button.MouseButton1Click:Connect(function()
    StatusLabel.Text = "Starting verification..."
    Button.Active = false
    Button.Text = "Please wait..."

    -- 1. POST to generate-task
    local url = VERCEL_BASE_URL .. "/api/generate-task"
    local success, response = pcall(function()
        return HttpService:PostAsync(url, "{}", Enum.HttpContentType.ApplicationJson)
    end)
    if not success then
        StatusLabel.Text = "Failed to start verification."
        Button.Active = true
        Button.Text = "Start Verification"
        return
    end

    local data = HttpService:JSONDecode(response)
    taskId = data.taskId
    local verifyUrl = VERCEL_BASE_URL .. data.verificationPageUrl

    -- 2. Copy verification page URL to clipboard
    if setclipboard then
        setclipboard(verifyUrl)
        StatusLabel.Text = "URL copied! Please open in browser."
    else
        StatusLabel.Text = "Copy this URL:\n" .. verifyUrl
    end

    -- 3. Start polling for task completion
    polling = true
    spawn(pollStatus)
end)

-- Main script entry point after verification
function RunMainScript(accessKey)
    -- Put your main code here. You have received the access key.
    print("Received key:", accessKey)
    -- Example: unlock features, authenticate, etc.
end