Imports System.Net
Imports System.Web.Http
Imports GA_MI_API.db
Imports Dapper

Public Class ValuesController
    Inherits ApiController

    ' GET api/values
    Public Function GetValues() As List(Of needLine)
        Dim str As List(Of needLine) = getNeedList()
        Return str
    End Function

    ' POST api/values
    Public Function PostValue(value As List(Of recLine)) As String
        Try
            Dim result As String
            If value.Item(0).pagepath <> Nothing Then
                result = insertPagePath(value)
            Else
                result = insertVolumes(value)
            End If

            Return "Ok"

        Catch e As Exception
            Return e.Message
        End Try
    End Function

End Class
