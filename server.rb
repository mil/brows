#!/usr/bin/ruby
require 'sinatra'
require 'sinatra/json'
require 'json'
settings.public_folder = "client"

get '/' do
  send_file File.join(
    settings.public_folder,
    "client.html"
  )
end
get '/api' do
  fp = "#{params['file_path']}/*"

  files = []
  folders = []
  Dir.glob(fp).select do |f|
    if (!File.directory? f) then
      files.push File.basename(f)
    else
      folders.push File.basename(f)
    end
  end


  json ({
    :files => files,
    :folders => folders
  })
end
